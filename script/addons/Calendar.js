/* Name: Calendar app
   Original code (c) Ben Chenoweth
   Initial version: July 2011
*/

tmp = function() {
	var appIcon = "DATE";
	var Calendar = {
		name: "Calendar",
		title: "Calendar",
		description: "Calendar app",
		comment: "and Events",
		icon: appIcon,			
		activate: function () {
			kbook.autoRunRoot.sandbox._icon =  Core.config.compat.NodeKinds.getIcon(appIcon,0);
			kbook.autoRunRoot.sandbox._title = Calendar.title;
			kbook.autoRunRoot.sandbox.getSoValue = Core.system.getSoValue;
			kbook.autoRunRoot.sandbox.setSoValue = Core.system.setSoValue;
			kbook.autoRunRoot.sandbox.hasNumericButtons = Core.config.compat.hasNumericButtons;
			kbook.autoRunRoot.sandbox.getFileContent = Core.io.getFileContent;
			kbook.autoRunRoot.sandbox.startsWith = Core.text.startsWith;
			kbook.autoRunRoot.sandbox.gamesSavePath = Core.config.userGamesSavePath;
			kbook.autoRunRoot.path = Core.config.addonsPath + "Calendar/calendar.xml";
			kbook.autoRunRoot.enterIf(kbook.model);
		},
		actions: [{
			name: "Calendar",
			group: "Games",
			icon: appIcon,
			action: function () {
				Calendar.activate();
			}
		}]
	};
	
	Core.addAddon(Calendar);
};
try {
	tmp();
} catch (e) {
	// Core's log
	log.error("in Calendar.js", e);
}