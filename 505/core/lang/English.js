// Language: English
// Description: Localization file
// Translator:
//
// History:
//	2010-04-30 kravitz - Refactored, added new strings
//	2010-05-01 kartu - Renamed "Viewer settings" to "Book Viewer Settings"
//	2010-05-01 kartu - Added ACTION_GOTO_LINK
//	2010-05-02 kartu - Added dictionary strings
//	2010-05-03 kravitz - Renamed ReadingList to BookHistory, added new strings, refactored MenuTuning
//	2010-05-06 kartu - Added ppm related translations for PageIndex addon
//	2010-05-11 kartu - Added VALUE_DEFAULT_DATE (CoreLang)
//	2010-05-14 kravitz - Added BookHistory strings

var FUNC_X_SOMETHING = function (n, s) {
	if (n > 1) {
		return n + " " + s[0];
	}
	if (n == 1) {
		return s[1];
	}
	return s[2];
};

var FUNC_X_BOOKS = function (n) {
	return FUNC_X_SOMETHING(n, ["books", "1 book", "No book"]);
};

var FUNC_X_SETTINGS = function (n) {
	return FUNC_X_SOMETHING(n, ["settings", "1 setting", "No setting"]);
};

var FUNC_X_ITEMS = function (n) {
	return FUNC_X_SOMETHING(n, ["items", "1 item", "No item"]);
};

return {
	// PRS+ stuff
	Core: {
		FUNC_X_BOOKS: FUNC_X_BOOKS,
		FUNC_X_SETTINGS: FUNC_X_SETTINGS,
		FUNC_X_ITEMS: FUNC_X_ITEMS,
		NODE_PRSP_SETTINGS:  "PRS+ Settings",
		NODE_OTHERS: "Multimedia",
		NODE_GAMES_AND_UTILS: "Games & Utilities",
		GROUP_MENU_TITLE: "Menu Settings",
		GROUP_VIEWER_TITLE: "Book Viewer Settings"
	},

	CoreLang: {
		TITLE: "Localization",
		COMMENT: "Requires restart",
		OPTION_LANG: "Language",

		OPTION_DATE_FORMAT: "Date Format",
		VALUE_DEFAULT_DATE: "Default",
		ddMMMYY: "31/Jan/99",
		ddMONTHYY: "31/January/99",
		ddMMMYYYY: "31/Jan/1999",
		ddMONTHYYYY: "31/January/1999",

		OPTION_DATE_SEPARATOR: "Date Separator",
		VALUE_SPACE: "Space",
		VALUE_NONE: "None",

		MONTH_SHORT_1: "Jan",
		MONTH_SHORT_2: "Feb",
		MONTH_SHORT_3: "Mar",
		MONTH_SHORT_4: "Apr",
		MONTH_SHORT_5: "May",
		MONTH_SHORT_6: "Jun",
		MONTH_SHORT_7: "Jul",
		MONTH_SHORT_8: "Aug",
		MONTH_SHORT_9: "Sep",
		MONTH_SHORT_10: "Oct",
		MONTH_SHORT_11: "Nov",
		MONTH_SHORT_12: "Dec",

		MONTH_1: "January",
		MONTH_2: "February",
		MONTH_3: "March",
		MONTH_4: "April",
		MONTH_5: "May",
		MONTH_6: "June",
		MONTH_7: "July",
		MONTH_8: "August",
		MONTH_9: "September",
		MONTH_10: "October",
		MONTH_11: "November",
		MONTH_12: "December"
	},

	MenuCaptions: {
		OPTION_STYLE: "Menu Captions Style",
		VALUE_SONY_DEFAULT: "Sony default",
		VALUE_ALWAYS_SMALL: "Always small",
		VALUE_ALWAYS_BIG: "Always big"
	},

	TextEncoding: {
		OPTION_TITLE: "TXT and RTF Books Encoding",
		MSG_RESTART: "Requires restart!",
		LATIN: "Latin",
		RUSSIAN:  "Russian (Windows-1251)"
	},

	KeyBindings: {
		TITLE: "Key Bindings",
		DESCRIPTION: "Allows to bind actions to keys",

		DEFAULT_VALUE: "Default",

		// Contexts
		GLOBAL:  "Global",
		IN_MENU: "When in Menu",
		IN_BOOK:  "When Reading Book",

		// Button groups
		NUM_BUTTONS: "Numeric Buttons",
		JP_BUTTONS: "Joypad Buttons",
		OTHER_BUTTONS: "Other Buttons",
		VOLUME_BUTTONS: "Volume Buttons",

		// Buttons
		BN_SIZE: "Size Button",
		BN_BOOKMARK: "Bookmark Button",
		BN_BL_NEXT: "Bottom Left 'Next'",
		BN_BL_PREVIOUS: "Bottom Left 'Previous'",
		BN_SB_NEXT: "Sidebar 'Next'",
		BN_SB_PREVIOUS:  "Sidebar 'Previous'",
		BN_MENU: "Menu Button",
		BN_JP_LEFT: "Joypad Left",
		BN_JP_RIGHT: "Joypad Right",
		BN_JP_UP: "Joypad Up",
		BN_JP_DOWN: "Joypad Down",
		BN_JP_CENTER: "Joypad Center",
		BN_H_SIZE: "Holding Size Button",
		BN_H_BOOKMARK: "Holding Bookmark Button",
		BN_H_BL_NEXT: "Holding Bottom Left 'Next Page'",
		BN_H_BL_PREVIOUS: "Holding Bottom Left 'Previous Page'",
		BN_H_MENU: "Holding Menu Button",
		BN_H_SB_NEXT: "Holding Sidebar 'Next Page'",
		BN_H_SB_PREVIOUS: "Holding Sidebar 'Previous Page'",
		BN_H_JP_CENTER: "Holding Joypad Center Button",
		BN_H_1: "Hold 1",
		BN_H_2: "Hold 2",
		BN_H_3: "Hold 3",
		BN_H_4: "Hold 4",
		BN_H_5: "Hold 5",
		BN_H_6: "Hold 6",
		BN_H_7: "Hold 7",
		BN_H_8: "Hold 8",
		BN_H_9: "Hold 9",
		BN_H_0: "Hold 0",
		BN_VOLUME_DOWN: "Volume -",
		BN_H_VOLUME_DOWN: "Hold Volume -",
		BN_VOLUME_UP: "Volume +",
		BN_H_VOLUME_UP: "Hold Volume +",

		// Actions
		ACTION_SHUTDOWN: "Shutdown",
		ACTION_NEXT_PAGE: "Next Page",
		ACTION_PREVIOUS_PAGE: "Previous Page",
		ACTION_NEXT_IN_HISTORY: "Next in History",
		ACTION_PREVIOUS_IN_HISTORY: "Previous in History",
		ACTION_PREVIOUS_SONG: "Previous Song",
		ACTION_NEXT_SONG: "Next Song",
		ACTION_GOTO_LINK: "Goto Link"
	},

	Screenshot: {
		TITLE: "Screenshot",
		ACTION_TITLE: "Take a Screenshot",
		SAVING_TO: "Saving to ",
		FAILED_TO_SAVE: "Failed to save",
		OPT_SAVETO: "Save to",
		OPT_FEEDBACK: "Show Save Progress",
		MEMORY_STICK: "Memory stick",
		FEEDBACK_ON: "On",
		FEEDBACK_OFF: "Off",
		SD_CARD: "SD card",
		INTERNAL_MEMORY: "Internal memory"
	},

	BrowseFolders: {
		TITLE:  "Browse Folders",
		OPTION_SORTING_MODE: "Sorting Mode",
		VALUE_BY_TITLE: "By title",
		VALUE_BY_AUTHOR_THEN_TITLE: "By author then title",
		VALUE_BY_AUTHOR_SWAPPING: "By author swapping name/surname",
		VALUE_BY_FILENAME: "By filename",
		OPTION_TITLE_SORTER: "Use 'titleSorter' Field, when Sorting",
		ENABLED: "Enabled",
		DISABLED: "Disabled",
		OPTION_IM_ROOT: "Internal Memory Root Folder",
		OPTION_CARD_SCAN: "SD/MS Card Scan",
		OPTION_MOUNT: "Use Mount with SD/MS (experimental)",
		NODE_RESCAN_INTERNAL_MEMORY: "Rescan Internal Memory",
		NODE_COPY_TO_INTERNAL_MEMORY: "Copy to Internal Memory",
		NODE_COPY_TO_INTERNAL_MEMORY_COMMENT: "Copies file to the internal memory root",
		NODE_COPY_AND_RESCAN: "Copy & Rescan Internal Memory",
		NODE_COPY_AND_RESCAN_COMMENT: "Copies file to the internal memory root and rescans books",
		ERROR_TARGET_EXISTS: "Error, target file exists",
		NODE_BROWSE_FOLDERS: "Browse Folders",
		NODE_BROWSE_FOLDERS_COMMENT: "Browse the file system",
		NODE_INTERNAL_MEMORY: "Internal Memory",
		NODE_MEMORY_STICK: "Memory Stick",
		NODE_MEMORY_STICK_MOUNT: "Memory Stick via Mount",
		NODE_SD_CARD: "SD Card",
		NODE_SD_CARD_MOUNT: "SD Card via Mount"
	},

	Clock: {
		TITLE: "Clock",
		OPTION_STYLE: "Clock Style",
		VALUE_24H: "24 hours",
		VALUE_12H: "12 hours",
		OPTION_MODE: "Clock Mode",
		VALUE_ALWAYS_SHOWN: "Always shown",
		VALUE_SHOWN_ONLY_IN_MENU: "Shown only in menu",
		VALUE_SHOWN_WHEN_READING: "Shown only when reading",
		VALUE_OFF: "Off",
		ACTION_TOGGLE_CLOCK: "Toggle Clock",
		AM: "am",
		PM: "pm"
	},

	PageIndex: {
		TITLE: "Page Index",
		INDEX_STYLE_BOOK: "Index Style in Books",
		INDEX_MODE_BOOK: "Index Mode in Books",
		INDEX_MODE_MENU: "Index Mode in Menu",
		INDEX_STYLE_MENU: "Index Style in Menu",
		OF: "of",
		ALWAYS_SHOWN: "Always shown",
		NEVER_SHOWN: "Never shown",
		NOT_SHOWN_IF_SINGLE_PAGE: "Not shown on single pages",
		VALUE_STATS0: "5 / 100 (page per minute)",
		VALUE_STATS1: "5 / 100 (time to finish)",
		VALUE_STATS2: "5 / 100 (ppm / time to finish)"
	},

	EpubUserStyle: {
		OPTION_EPUB_CSS_FILE: "User EPUB Style (CSS File)",
		MSG_WARNING: "Affects only books opened afterwards!",
		VALUE_DISABLED: "Disabled"
	},

	BookHistory: {
		FUNC_X_BOOKS: FUNC_X_BOOKS,
		TITLE: "Book History",
		PAGE: "Page",
		VALUE_DISABLED: "Disabled",
		OPTION_REPLACE: "History into Continue Reading",
		VALUE_ON: "On",
		VALUE_OFF: "Off",
		OPTION_THROUGH: "History Leads to",
		VALUE_MENU: "Book menu",
		VALUE_TEXT: "Book text"
	},

//ReadMark	ReadMark: {
//		TITLE_UNREAD: "Mark Book - Already Read",
//		TITLE_READ: "Mark Book - Not Yet Read",
//	},

	TextScale: {
		OPTION_SCALE_DEFAULT: "Default Scale",
		VALUE_SMALL: "(S)mall Size",
		VALUE_MEDIUM: "(M)edium Size",
		VALUE_LARGE: "(L)arge Size",
		VALUE_DISABLED: "Disabled",
		VALUE_ENABLED: "Enabled"
	},

	MenuTuning: {
		OPTION_OUTER: "Top Level Menu Contains"
	},

	Dictionary: {
		TITLE: "Dictionary",
		WARN_DICT_DISABLED: "Dictionary is disabled!",
		WARN_DICT_DOESNT_EXIST: "Dictionary file doesn't exist!",
		ACTION_DICTIONARY: "Launch Dictionary",
		OPTION_DICTIONARY: "Dictionary File",
		VALUE_DISABLED: "Disabled"
	}
};
