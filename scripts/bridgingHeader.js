module.exports = function(ctx) {
    // make sure ios platform is part of build
    if (ctx.opts.platforms.indexOf('ios') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
		childProcess = ctx.requireCordovaModule( 'child_process' )

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/ios');
	
	let xcodeProjectName = childProcess.execSync( 'ls ' + platformRoot + '/ | grep xcodeproj' );
	let dirName = xcodeProjectName.toString().split(".")[0].split(" ");

	var commandDirName = ''
	for (var index in dirName) {
	  if (index == 0) {
		commandDirName += dirName[index]
	  } else {
	  	commandDirName += '\\ ' + dirName[index]
	  }
	}
	
	let bridgingHeaderPath = '/Users/tim/Desktop/Bridging-Header.h';

	if ( fs.existsSync( bridgingHeaderPath ) ) {
		var CDVRegex = /#import \<Cordova\/CDV.h\>\s/mgi;
		var CDVPluginRegex = /#import \<Cordova\/CDVPlugin.h\>\s/mgi;
		var bridgingHeader = fs.readFileSync( bridgingHeaderPath, 'utf-8' );
		if ( !CDVRegex.test(bridgingHeader) ) {
			bridgingHeader = bridgingHeader.trim();
			bridgingHeader = bridgingHeader + '\n#import <Cordova/CDV.h>\n';
		}
		if ( !CDVPluginRegex.test(bridgingHeader) ) {
			bridgingHeader = bridgingHeader.trim();
			bridgingHeader = bridgingHeader + '\n#import <Cordova/CDVPlugin.h>\n';
		}
		fs.writeFileSync( bridgingHeaderPath, bridgingHeader );
	} else {
		bridgingHeader = "#import <Cordova/CDV.h>\n#import <Cordova/CDVPlugin.h>\n"
		fs.writeFileSync( bridgingHeaderPath, bridgingHeader );
	}

    return;
};