// Name: BookManagement_x50
// Description: Allows to set 'new' flag manually, to hide default collections,
//				to show reading progress in home menu and thumbnail views
//				and to customize home menu booklist
// 
// Author: quisvir
//
// History:
//	2011-08-29 quisvir - Initial version
//	2011-08-31 quisvir - Avoid assets.xml and change terminology
//	2011-09-04 Mark Nord - preserve Add-Collection, added icons
//	2011-09-05 quisvir - Extend Hide Collection options to 1 option per collection entry
//	2011-09-05 quisvir - Add reading progress in home menu and thumbnail views
//	2011-09-08 quisvir - Format options now correspond to statusbar options, and fewer strings needed
//	2011-09-09 quisvir - Added exception for reading progress in thumbnail checkbox view
//	2011-09-10 quisvir - Reading Progress: Fixed menu lockups in views other than books
//	2011-09-12 quisvir - Added Home Menu Booklist customization
//	2011-09-14 quisvir - Fixed Booklist bug on searching history (thanks MiK77)
//	2011-09-14 quisvir - Fixed bug in Reading Progress if there is no current book
//	2011-09-15 quisvir - Fixed bug where booklist wasn't correct after startup (via workaround)
//	2011-09-16 quisvir - More bugfixes, booklist partly rewritten
//	2011-09-18 quisvir - Rename to BookManagement_x50, booklist speed improvements, add random booklist option
//	2011-09-20 quisvir - Use PRS+ book history instead of cache for 'last opened books' booklist
//	2011-09-22 quisvir - Display current booklist option in home menu
//	2011-09-27 quisvir - Add ability to cycle through collections for 'next in collection' booklist
//	2011-09-28 quisvir - Display current collection in home menu, add option to ignore memory cards
//	2011-10-04 quisvir - Add option to treat periodicals as books
//	2011-11-20 quisvir - Added sub-collection support (max 1 sub-level, using | as separator)
//	2011-11-25 quisvir - Added booklist option 'Select Collection' & action
//	2011-12-04 quisvir - Split cycle booklist action into cycle forward & backward actions
//  2011-12-04 Ben Chenoweth - Added "Next/Previous Books In History" actions
//  2011-12-05 Ben Chenoweth - Reset "Last Opened Books" when new book selected

tmp = function() {

	var L, LX, log, opt, bookChanged, booklistTrigger1, booklistTrigger2, doSelectCollection, selectCollectionConstruct, selectCollectionDestruct, tempCollectionNode, oldParentNode, numCurrentBook;
	
	L = Core.lang.getLocalizer('BookManagement');
	LX = Core.lang.LX;
	log = Core.log.getLogger('BookManagement');
	
	numCurrentBook = 0;
	
	// Treat Periodicals as Books
	var oldBooksFilter = kbook.root.children.deviceRoot.children.books.filter;
	kbook.root.children.deviceRoot.children.books.filter = function (result) {
		if (opt.PeriodicalsAsBooks == 'true') return result;
		else return oldBooksFilter.apply(this, arguments);
	}
	
	var oldIsPeriodical = FskCache.text.isPeriodical;
	FskCache.text.isPeriodical = function () {
		if (opt.PeriodicalsAsBooks == 'true') return false;
		else return oldIsPeriodical.apply(this, arguments);
	}
	
	var oldIsNewspaper = FskCache.text.isNewspaper;
	FskCache.text.isNewspaper = function () {
		if (opt.PeriodicalsAsBooks == 'true') return false;
		else return oldIsNewspaper.apply(this, arguments);
	}
	
	var oldOnEnterShortCutBook = kbook.model.onEnterShortCutBook;
	kbook.model.onEnterShortCutBook = function (node) {
		if (opt.PeriodicalsAsBooks == 'true' && node.periodicalName) this.currentNode.gotoNode(node, this);
		else oldOnEnterShortCutBook.apply(this, arguments);
	};
	
	// Keep new flag as is on opening book
	var oldOnChangeBook = kbook.model.onChangeBook;
	kbook.model.onChangeBook = function (node) {
		if (this.currentPath) oldOnChangeBook.apply(this, arguments);
		else {
			if (this.currentBook) opt.CurrentCollection = '';
			var newflag = node.opened;
			oldOnChangeBook.apply(this, arguments);
			if (opt.ManualNewFlag == 'true') node.opened = newflag;
			bookChanged = true;
		}
	}
	
	// Book menu option to switch new flag, called from main.xml
	kbook.model.container.sandbox.OPTION_OVERLAY_PAGE.sandbox.NewFlagToggle = function () {
		this.doOption();
		var book = kbook.model.currentBook;
		book.opened = (book.opened) ? false : true;
	}
	
	// Show book menu option if preference is set
	kbook.optMenu.isDisable = function (part) {
		if (this.hasString(part, 'manualnewflag')) {
			if (opt.ManualNewFlag == 'true') {
				part.text = (kbook.model.currentBook.opened) ? L('SETNEWFLAG') : L('REMOVENEWFLAG');
				return Fskin.overlayTool.isDisable(part);
			}
			else return true;
		}
		else return Fskin.overlayTool.isDisable(part);
	}

	// Hide default collections
	var oldKbookPlaylistNode = kbook.root.kbookPlaylistNode.construct;
	kbook.root.kbookPlaylistNode.construct = function () {
		oldKbookPlaylistNode.apply(this, arguments);
		if (opt.HideAddNewCollection == 'true') {
			this.nodes.splice(this.purchasedNodeIndex + 1,1);
			this.constNodesCount--;
		}
		if (opt.HidePurchasedBooks == 'true') {
			this.nodes.splice(this.purchasedNodeIndex,1);
			this.constNodesCount--;
			this.presetItemsCount--;
		}
		if (opt.HideUnreadPeriodicals == 'true') {
			this.nodes.splice(this.purchasedNodeIndex - 1,1);
			this.constNodesCount--;
			this.presetItemsCount--;
		}
		if (opt.HideUnreadBooks == 'true') {
			this.nodes.splice(this.purchasedNodeIndex - 2,1);
			this.constNodesCount--;
			this.presetItemsCount--;
		}
		createSubCollections(this.nodes, this, this.constNodesCount);
	}

	createSubCollections = function (nodes, parent, next) {
		var i, node, last, idx, coll, title;
		i = next;
		c = nodes.length;
		while (i < c) {
			title = nodes[i].title;
			idx = title.indexOf('|');
			if (idx != -1) {
				nodes[i].name = nodes[i].title = title.slice(idx+1);
				coll = title.slice(0,idx);
				if (last == coll) {
					nodes[i].parent = nodes[next-1];
					nodes[next-1].nodes.push(nodes.splice(i,1)[0]);
					i--; c--;
				} else {
					node = Core.ui.createContainerNode({
						title: coll,
						comment: function () {
							return Core.lang.LX('COLLECTIONS', this.nodes.length);
						},
						parent: parent,
						icon: 'BOOKS'
					});
					nodes[i].parent = node;
					node.sublistMark = true;
					node.nodes.push(nodes.splice(i,1)[0]);
					nodes.splice(next,0,node);
					last = coll;
					next++;
				}
			}
			i++;
		}
		if (last) nodes[next-1].separator = 1;
	}
	
	// Draw reading progress instead of 'last read' date/time
	kbook.model.getContinueDate = function (node) {
		if (opt.ShowReadingProgressCurrent == 'true' && this.currentBook) {
			var page = this.currentBook.media.ext.currentPosition.page + 1;
			if (page < Number(opt.OnlyShowFromPage)) return node.nodes[0].lastReadDate;
			var pages = this.currentBook.media.ext.history[0].pages;
			return readingProgressComment(page, pages, opt.ProgressFormatCurrent);
		}
		else return node.nodes[0].lastReadDate;
	}
	
	// Draw reading progress below thumbnails (both home screen and book lists)
	var oldThumbnaildrawRecord = Fskin.kbookViewStyleThumbnail.drawRecord;
	Fskin.kbookViewStyleThumbnail.drawRecord = function (offset, x, y, width, height, tabIndex, parts) {
		oldThumbnaildrawRecord.apply(this, arguments);
		var record, page, pages, msg, opt = BookManagement_x50.options;
		if (kbook.model.currentNode.title == 'deviceRoot' && offset == 2) {
			if (opt.HomeMenuBooklist == 5) msg = opt.SelectedCollection;
			else if (opt.HomeMenuBooklist == 3 && opt.CurrentCollection) msg = L('NEXT_IN') + ' ' + opt.CurrentCollection;
			else msg = BookManagement_x50.optionDefs[0].optionDefs[0].valueTitles[opt.HomeMenuBooklist];
			msg = msg.replace('|',': '); // sub-collections
			this.skin.styles[6].draw(this.getWindow(), msg, 0, y-25, this.width, this.textCommentHeight);
		}
		record = this.menu.getRecord(offset);
		if (record && opt.ShowReadingProgressThumbs == 'true') {
			if (record.kind != 2 || !record.media.ext || !record.media.ext.history.length || (this.statusVisible && (record.media.sourceid > 1 || this.menu.getFixSelectPosition() || record.expiration))) return;
			page = record.media.ext.currentPosition.page + 1;
			if (page < Number(opt.OnlyShowFromPage)) return;
			pages = record.media.ext.history[0].pages;
			msg = readingProgressComment(page, pages, opt.ProgressFormatThumbs);
			parts.commentStyle.draw(this.getWindow(), msg, x+this.marginWidth, this.getNy(this.getTy(y),Math.min(this.getTh(height),this.thumbnailHeight))+this.textNameHeight+this.marginNameAndComment + 23, this.getCw(width, Fskin.scratchRectangle.width), this.textCommentHeight);
		}
	};
	
	// Format reading progress comment
	readingProgressComment = function (page, pages, format) {
		switch (format) {
			case '1': return L('PAGE') + ' ' + page + ' ' + L('OF') + ' ' + pages;
			case '2': return L('PAGE') + ' ' + page + ' ' + L('OF') + ' ' + pages + ' (' + Math.floor((page/pages)*100) + '%)';
			case '3': return page + ' ' + L('OF') + ' ' + pages;
			case '4': return page + ' ' + L('OF') + ' ' + pages + ' (' + Math.floor((page/pages)*100) + '%)';
			case '5': return Math.floor((page/pages)*100) + '%';
			case '6': return page + ' / ' + pages;
			case '7': return page + ' / ' + pages + ' (' + Math.floor((page/pages)*100) + '%)';
			case '8': return L('PAGE') + ' ' + page + ' / ' + pages + ' (' + Math.floor((page/pages)*100) + '%)';
		}
	}

	// Code to randomize array from jsfromhell.com
	arrayShuffle = function (v) {
		for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
	};

	// Update deviceroot on enter
	var oldOnEnterDeviceRoot = kbook.model.onEnterDeviceRoot;
	kbook.model.onEnterDeviceRoot = function () {
		oldOnEnterDeviceRoot.apply(this, arguments);
		if (opt.HomeMenuBooklist && bookChanged) {
			numCurrentBook = 0; // reset "last opened books" so that most recently opened books are displayed
			kbook.root.nodes[0].nodes[6].update(kbook.model);
			bookChanged = false;
		}
	}
	
	// Update 'next in collection' booklist after collection edit
	var oldFinishCollectionEdit = kbook.model.finishCollectionEdit;
	kbook.model.finishCollectionEdit = function () {
		var i, change, current, opt = BookManagement_x50.options;
		if (this.colManTgtNode && (opt.HomeMenuBooklist == 3 || opt.HomeMenuBooklist == 5)) {
			current = (opt.CurrentCollection) ? opt.CurrentCollection : opt.SelectedCollection;
			if (this.colManTgtNode.kind == 42 && this.colManTgtNode.title == current) change = true;
			else if (this.colManTgtNode.kind == 17) {
				for (i=0;i<this.colManItems.length&&this.colManItems[i].title!=current;i++);
				if (i != this.colManItems.length) change = true;
			}
			if (change) {
				bookChanged = true;
				opt.CurrentCollection = '';
			}
		}
		oldFinishCollectionEdit.apply(this, arguments);
	}
	
	// Customize book list in home menu
	kbook.root.children.deviceRoot.children.bookThumbnails.construct = function () {
		var i, nodes, prototype, cache, result, result2, current, records, node, model, opt;
		FskCache.tree.xdbNode.construct.call(this);
		model = kbook.model;
		opt = BookManagement_x50.options;
		nodes = this.nodes = [];
		prototype = this.prototype;
		cache = this.cache;
		while (cache) {
			if (opt.IgnoreCards == 'true') result = cache.getSourceByName('mediaPath').textMasters;
			else result = cache.textMasters;
			if (opt.PeriodicalsAsBooks == 'false') result = this.filter(result);
			records = result.count();
			if (!records) return;
			if (model.currentBook) current = model.currentBook.media;
			else if (model.currentPath) {
				result2 = result.db.search('indexPath',model.currentPath);
				if (result2.count()) current = result2.getRecord(0);
			}
			switch (opt.HomeMenuBooklist) {
				case 0: // Booklist option: last added books
					obj0 = {};
					obj0.by = 'indexDate';
					obj0.order = xdb.descending;
					result.sort_c(obj0);
					for(i=0;i<3&&i<records;i++) {
						node = nodes[i] = xs.newInstanceOf(prototype);
						node.cache = cache;
						node.media = result.getRecord(i);
					}
					break;
				case 1: // Booklist option: last opened books
					var i, j, history=[], record;
					history = Core.addonByName.BookHistory.getBookList();
					j = (current) ? 1 : 0;
					for (i=numCurrentBook;nodes.length<3&&i+j<history.length;i++) {
						record = Core.media.findMedia(history[i+j]);
						if (record) {
							if (record.periodicalName && opt.PeriodicalsAsBooks == 'false') continue;
							node = nodes[nodes.length] = xs.newInstanceOf(prototype);
							node.cache = cache;
							node.media = record;
						}
					}
					break;
				case 2: // Booklist option: books by same author
					var i, id, author, record, list=[];
					if (!current) break;
					id = current.id;
					author = current.author;
					if (author) {
						// Find other books by same author, excluding current book
						for (i=0;i<records;i++) {
							record = result.getRecord(i);
							if (record.author == author && record.id != id) list.push(i);
						}
						// Shuffle book list and add first 3 items to nodes
						list = arrayShuffle(list);
						for (i=0;i<3&&i<list.length;i++) {
							node = nodes[i] = xs.newInstanceOf(prototype);
							node.cache = cache;
							node.media = result.getRecord(list[i]);
						}
					}
					break;
				case 3: // Booklist option: next books in collection
					var i=0, j, k, id, result2, colls, coll, books;
					if (current) {
						id = current.id;
						// Switch to collections cache
						result2 = cache.playlistMasters;
						result2.sort('indexPlaylist');
						colls = result2.count();
						if (opt.CurrentCollection) {
							for (i=0;i<colls&&result2.getRecord(i).title!=opt.CurrentCollection;i++);
							if (i==colls) i=0;
							else if (booklistTrigger1) i++;
						}
						while (i<colls) {
							coll = result2.getRecord(i);
							books = coll.count();
							j = coll.getItemIndex(id) + 1;
							if (j && j<books) {
								// Current book found in collection where it's not the last book
								for (k=0;k<3&&j<books;j++,k++) {
									node = nodes[k] = xs.newInstanceOf(prototype);
									node.cache = cache;
									node.media = cache.getRecord(coll.items[j].id);
								}
								break;
							}
							i++;
						}
					}
					opt.CurrentCollection = (nodes.length) ? coll.title : '';
					break;
				case 4: // Booklist option: random books
					var i, j, id, books=[], record;
					if (current) id = current.id;
					for (i=0;i<records;i++) books.push(i);
					books = arrayShuffle(books);
					for (i=0,j=0;i<3&&j<books.length;i++,j++) {
						record = result.getRecord(books[j]);
						if (record.id == id) i--;
						else {
							node = nodes[i] = xs.newInstanceOf(prototype);
							node.cache = cache;
							node.media = record;
						}
					}
				break;
				case 5: // Booklist option: Select collection
					var i, id, idx, result2, colls, coll, books;
					if (!opt.SelectedCollection) break;
					if (current) id = current.id;
					result2 = cache.playlistMasters;
					result2.sort('indexPlaylist');
					colls = result2.count();
					for (i=0;i<colls&&result2.getRecord(i).title!=opt.SelectedCollection;i++);
					if (i == colls) break;
					// Selected Collection found
					coll = result2.getRecord(i);
					books = coll.items;
					idx = coll.getItemIndex(id) + 1;
					i = (idx) ? idx : 0;
					while (nodes.length < 3) {
						if (idx) {
							if (i == books.length) i = 0;
							if (books[i].id == id) break;
						} else {
							if (i == books.length) break;
						}
						node = nodes[nodes.length] = xs.newInstanceOf(prototype);
						node.cache = cache;
						node.media = cache.getRecord(books[i].id);
						i++;
					}
				break;
			}
			if (!nodes.length) {
				if (booklistTrigger1) {
					if (opt.HomeMenuBooklist == 5) opt.HomeMenuBooklist = 0;
					else opt.HomeMenuBooklist++;
					continue;
				} else if (booklistTrigger2) {
					if (opt.HomeMenuBooklist == 0) opt.HomeMenuBooklist = 5;
					else opt.HomeMenuBooklist--;
					continue;
				}
			}
			booklistTrigger1 = booklistTrigger2 = false;
			break;
		}
	};
	
	// Functions for booklist option 'Select Collection'
	doSelectCollection = function () {
		oldNode = kbook.model.currentNode;
		oldNode.redirect = true;
		tempCollectionNode = Core.ui.createContainerNode({
			title: L('SELECT_COLLECTION'),
			parent: oldNode,
			construct: selectCollectionConstruct,
			destruct: selectCollectionDestruct
		});
		oldNode.gotoNode(tempCollectionNode, kbook.model);
	}
	
	selectCollectionConstruct = function () {
		var i, nodes, result, records;
		nodes = this.nodes = [];
		result = kbook.model.cache['playlistMasters'];
		result.sort('indexPlaylist');
		records = result.count();
		for (i=0;i<records;i++) {
			nodes[i] = Core.ui.createContainerNode({
				title: result.getRecord(i).title,
				comment: LX('BOOKS', result.getRecord(i).count()),
				icon: 'BOOKS'
			});
			nodes[i].onEnter = 'collectionSelected';
			nodes[i].collName = result.getRecord(i).title;
		}
		if (nodes.length) createSubCollections(nodes, this, 0);
	}
	
	selectCollectionDestruct = function () {
		tempCollectionNode = null;
		oldNode.redirect = null;
	}
	
	kbook.model.collectionSelected = function (node) {
		opt.HomeMenuBooklist = 5;
		opt.SelectedCollection = node.collName;
		Core.settings.saveOptions(BookManagement_x50);
		kbook.root.nodes[0].nodes[6].update(kbook.model);
		kbook.menuHomeThumbnailBookData.setNode(kbook.root.nodes[0].nodes[6]);
		this.currentNode.gotoNode(((oldNode.title == L('BOOK_SELECTION'))?oldNode.parent:oldNode), this);
	}
		
	var BookManagement_x50 = {
		name: 'BookManagement_x50',
		title: L('TITLE'),
		icon: 'BOOKS',
		onInit: function () {
			opt = this.options;
			// Workaround for numerical settings being saved as strings
			opt.HomeMenuBooklist = parseInt(opt.HomeMenuBooklist);
		},
		actions: [{
			name: 'BookListCycleForward',
			title: L('BOOKLIST_CYCLE_FORWARD'),
			group: 'Other',
			icon: 'BOOKS',
			action: function () {
				booklistTrigger1 = true;
				if (opt.HomeMenuBooklist == 5) opt.HomeMenuBooklist = 0;
				else if (opt.HomeMenuBooklist != 3) {
					opt.HomeMenuBooklist++;
					opt.CurrentCollection = '';
				}
				if (kbook.model.currentNode.title == 'deviceRoot') {
					kbook.root.nodes[0].nodes[6].update(kbook.model);
					kbook.menuHomeThumbnailBookData.setNode(kbook.root.nodes[0].nodes[6]);
				}
				else bookChanged = true;
				Core.settings.saveOptions(BookManagement_x50); // FIXME radio button in PRS+ settings isn't updated
			}
		},
		{
			name: 'BookListCycleBackward',
			title: L('BOOKLIST_CYCLE_BACKWARD'),
			group: 'Other',
			icon: 'BOOKS',
			action: function () {
				booklistTrigger2 = true;
				if (opt.HomeMenuBooklist == 0) opt.HomeMenuBooklist = 5;
				else {
					opt.HomeMenuBooklist--;
					opt.CurrentCollection = '';
				}
				if (kbook.model.currentNode.title == 'deviceRoot') {
					kbook.root.nodes[0].nodes[6].update(kbook.model);
					kbook.menuHomeThumbnailBookData.setNode(kbook.root.nodes[0].nodes[6]);
				}
				else bookChanged = true;
				Core.settings.saveOptions(BookManagement_x50); // FIXME radio button in PRS+ settings isn't updated
			}
		},
		{
			name: 'BookListSelectCollection',
			title: L('BOOKLIST_SELECT_COLLECTION'),
			group: 'Other',
			icon: 'BOOKS',
			action: function () {
				doSelectCollection();
			}
		},
		{
			name: 'NextBooksInHistory',
			title: L('NEXT_BOOKS_IN_HISTORY'),
			group: 'Other',
			icon: 'NEXT',
			action: function () {
				var j, history=[];
				if (opt.HomeMenuBooklist == 1) {
					if (kbook.model.currentNode.title == 'deviceRoot') {
						history = Core.addonByName.BookHistory.getBookList();
						numCurrentBook += 3;
						j = (kbook.model.currentBook) ? 1 : 0;
						if (numCurrentBook >= history.length-j) {
							numCurrentBook -= 3;
						} else {
							kbook.root.nodes[0].nodes[6].update(kbook.model);
							kbook.menuHomeThumbnailBookData.setNode(kbook.root.nodes[0].nodes[6]);
						}
					}
				}
			}
		},
		{
			name: 'PreviousBooksInHistory',
			title: L('PREVIOUS_BOOKS_IN_HISTORY'),
			group: 'Other',
			icon: 'PREVIOUS',
			action: function () {
				var history=[];
				if (opt.HomeMenuBooklist == 1) {
					if (kbook.model.currentNode.title == 'deviceRoot') {
						history = Core.addonByName.BookHistory.getBookList();
						numCurrentBook -= 3;
						if (numCurrentBook < 0) {
							numCurrentBook = 0;
						} else {
							kbook.root.nodes[0].nodes[6].update(kbook.model);
							kbook.menuHomeThumbnailBookData.setNode(kbook.root.nodes[0].nodes[6]);
						}
					}
				}
			}
		}],
		optionDefs: [
			{
			groupTitle: L('CUSTOMIZE_HOME_MENU_BOOKLIST'),
			groupIcon: 'BOOKS',
			optionDefs: [
			{
				name: 'HomeMenuBooklist',
				title: L('BOOK_SELECTION'),
				icon: 'BOOKS',
				defaultValue: 0,
				values: [0, 1, 2, 3, 4, 5],
				valueTitles: {
					0: L('LAST_ADDED_BOOKS'),
					1: L('LAST_OPENED_BOOKS'),
					2: L('BOOKS_BY_SAME_AUTHOR'),
					3: L('NEXT_BOOKS_IN_COLLECTION'),
					4: L('RANDOM_BOOKS'),
					5: L('SELECT_COLLECTION') + '...'
				}
			},
			{
				name: 'IgnoreCards',
				title: L('IGNORE_MEMORY_CARDS'),
				icon: 'DB',
				defaultValue: 'false',
				values: ['true','false'],
				valueTitles: {
					'true': L('VALUE_TRUE'),
					'false': L('VALUE_FALSE')
				}
			},
			]},
			{
			groupTitle: L('SHOW_READING_PROGRESS'),
			groupIcon: 'BOOKMARK',
			optionDefs: [
				{
				name: 'ShowReadingProgressCurrent',
				title: L('SHOW_READING_PROGRESS_CURRENT'),
				icon: 'BOOKMARK',
				defaultValue: 'false',
				values: ['true','false'],
				valueTitles: {
					'true': L('VALUE_TRUE'),
					'false': L('VALUE_FALSE')
				}
				},
				{
				name: 'ProgressFormatCurrent',
				title: L('PROGRESS_FORMAT_CURRENT'),
				icon: 'SETTINGS',
				defaultValue: '2',
				values: ['1', '2', '3', '4', '5', '6', '7', '8'],
				valueTitles: {
					'1': L('PAGE') + ' 5 ' + L('OF') + ' 100',
					'2': L('PAGE') + ' 5 ' + L('OF') + ' 100 (5%)',
					'3': '5 ' + L('OF') + ' 100',
					'4': '5 ' + L('OF') + ' 100 (5%)',
					'5': '5%',
					'6': '5 / 100',
					'7': '5 / 100 (5%)',
					'8': L('PAGE') + ' 5 / 100 (5%)'
				}
				},
				{
				name: 'ShowReadingProgressThumbs',
				title: L('SHOW_READING_PROGRESS_THUMBS'),
				icon: 'BOOKMARK',
				defaultValue: 'false',
				values: ['true','false'],
				valueTitles: {
					'true': L('VALUE_TRUE'),
					'false': L('VALUE_FALSE')
				}
				},
				{
				name: 'ProgressFormatThumbs',
				title: L('PROGRESS_FORMAT_THUMBS'),
				icon: 'SETTINGS',
				defaultValue: '3',
				values: ['1', '2', '3', '4', '5', '6', '7', '8'],
				valueTitles: {
					'1': L('PAGE') + ' 5 ' + L('OF') + ' 100',
					'2': L('PAGE') + ' 5 ' + L('OF') + ' 100 (5%)',
					'3': '5 ' + L('OF') + ' 100',
					'4': '5 ' + L('OF') + ' 100 (5%)',
					'5': '5%',
					'6': '5 / 100',
					'7': '5 / 100 (5%)',
					'8': L('PAGE') + ' 5 / 100 (5%)'
				}
				},
				{
				name: 'OnlyShowFromPage',
				title: L('ONLY_SHOW_FROM_PAGE'),
				icon: 'SETTINGS',
				defaultValue: '2',
				values: ['1', '2', '3', '4', '5', '10', '15', '20', '25', '50'],
				},
			]},
			{
			groupTitle: L('HIDE_DEFAULT_COLLECTIONS'),
			groupIcon: 'BOOKS',
			optionDefs: [
				{
					name: 'HideUnreadBooks',
					title: L('HIDE_UNREAD_BOOKS'),
					icon: 'BOOKS',
					defaultValue: 'false',
					values: ['true','false'],
					valueTitles: {
						'true': L('VALUE_TRUE'),
						'false': L('VALUE_FALSE')
					}
				},
				{
					name: 'HideUnreadPeriodicals',
					title: L('HIDE_UNREAD_PERIODICALS'),
					icon: 'BOOKS',
					defaultValue: 'false',
					values: ['true','false'],
					valueTitles: {
						'true': L('VALUE_TRUE'),
						'false': L('VALUE_FALSE')
					}
				},
				{
					name: 'HidePurchasedBooks',
					title: L('HIDE_PURCHASED_BOOKS'),
					icon: 'BOOKS',
					defaultValue: 'false',
					values: ['true','false'],
					valueTitles: {
						'true': L('VALUE_TRUE'),
						'false': L('VALUE_FALSE')
					}
				},
				{
					name: 'HideAddNewCollection',
					title: L('HIDE_ADD_NEW_COLLECTION'),
					icon: 'BOOKS',
					defaultValue: 'false',
					values: ['true','false'],
					valueTitles: {
						'true': L('VALUE_TRUE'),
						'false': L('VALUE_FALSE')
					}
				},
			]},
			{
				name: 'PeriodicalsAsBooks',
				title: L('TREAT_PERIODICALS_AS_BOOKS'),
				icon: 'PERIODICALS',
				defaultValue: 'false',
				values: ['true', 'false'],
				valueTitles: {
					'true': L('VALUE_TRUE'),
					'false': L('VALUE_FALSE')
				}	
			},
			{
				name: 'ManualNewFlag',
				title: L('SET_NEW_FLAG_MANUALLY'),
				icon: 'NEW',
				defaultValue: 'false',
				values: ['true', 'false'],
				valueTitles: {
					'true': L('VALUE_TRUE'),
					'false': L('VALUE_FALSE')
				}	
			},
			{
				name: 'CurrentCollection',
				defaultValue: '',
				hidden: 'true',
			},
			{
				name: 'SelectedCollection',
				defaultValue: '',
				hidden: 'true',
			},
		],
		onSettingsChanged: function (propertyName, oldValue, newValue, object) {
			if (propertyName == 'HomeMenuBooklist' || propertyName == 'IgnoreCards') {
				bookChanged = true;
				opt.CurrentCollection = '';
			}
			if (propertyName == 'HomeMenuBooklist' && newValue == 5) doSelectCollection();
			numCurrentBook = 0;
		}
	};

	Core.addAddon(BookManagement_x50);
};
try {
	tmp();
} catch (e) {
	// Core's log
	log.error('in BookManagement.js', e);
}
