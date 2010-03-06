// Name: EpubUserStyle
// Description: Allows to choose switch between epub .css styles
// Author: kartu
//
// History:
//	2010-03-05 kartu - Initial version
//

var log = Utils.getLogger("EpubUserStyle");

var str = {
	TITLE: "EPUB User Style",
	COMMENT: "Experimental, affects only books opened afterwards",
	
	OPTION_EPUB_CSS_FILE: "User EPUB css file",
	VALUE_DISABLED: "disabled"
};

// Localize
var L = function (key) {
	if (str.hasOwnProperty(key)) {
		return str[key];
	} else {
		return "EpubStyleSwitcher." + key;
	}
};

var endsWith = Utils.string.endsWith;

// Constants
var USER_CSS = "style.css";
var DISABLED = "disabled"; 

var EpubUserStyle = {
	name: "EpubUserStyle",
	title: L("TITLE"),
	description: L("DESCRIPTION"),
	comment: L("COMMENT"),
	icon: "BACK",
	optionDefs: [
		{
			name: "epubCssFile",
			title: L("OPTION_EPUB_CSS_FILE"),
			icon: "LIST",
			defaultValue: DISABLED,
			values: [DISABLED],
			valueTitles: {
				disabled: L("VALUE_DISABLED")
			}
		}
	],
	root: Utils.config.root + "epub/",
	onPreInit : function() {
		// Init epubCssFile values
		var iterator = new FileSystem.Iterator(this.root);
		try {
			var item, path;
			var od = this.optionDefs[0];
			while (item = iterator.getNext()) {
				if ( item.type == "file" ) {
					path = item.path;
					if (path !== USER_CSS && endsWith(path, ".css")) {
						od.values.push(path);
						od.valueTitles[path]  = path;
					}
				}
			}
		} finally {
			iterator.close();
		}
	},
	onSettingsChanged: function(propertyName, oldValue, newValue, object) {
		if (newValue === DISABLED) {
			FileSystem.deleteFile(EpubUserStyle.root + USER_CSS);
		} else {
			Utils.copyFile(EpubUserStyle.root + newValue, EpubUserStyle.root + USER_CSS);
		}
	}
};

return EpubUserStyle;