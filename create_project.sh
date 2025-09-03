#!/bin/bash

echo "🏀 Creating new Basketball Form Analyzer project..."

# Create a new iOS app project
xcodebuild -project . -scheme BasketballFormAnalyzer -destination 'platform=iOS Simulator,name=iPhone 15' build 2>/dev/null || {
    echo "Creating new project structure..."
    
    # Create project directory structure
    mkdir -p BasketballFormAnalyzer.xcodeproj/project.xcworkspace/xcshareddata
    mkdir -p BasketballFormAnalyzer.xcodeproj/project.xcworkspace/xcuserdata
    mkdir -p BasketballFormAnalyzer.xcodeproj/xcuserdata
    
    # Create workspace file
    cat > BasketballFormAnalyzer.xcodeproj/project.xcworkspace/contents.xcworkspacedata << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "self:BasketballFormAnalyzer.xcodeproj">
   </FileRef>
</Workspace>
EOF

    # Create project.pbxproj with minimal working structure
    cat > BasketballFormAnalyzer.xcodeproj/project.pbxproj << 'EOF'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
		A1234567890123456789012A /* BasketballFormAnalyzerApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789012B /* BasketballFormAnalyzerApp.swift */; };
		A1234567890123456789012C /* ContentView.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789012D /* ContentView.swift */; };
		A1234567890123456789012E /* CameraManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789012F /* CameraManager.swift */; };
		A1234567890123456789013A /* PoseAnalyzer.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789013B /* PoseAnalyzer.swift */; };
		A1234567890123456789013C /* AudioFeedbackManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789013D /* AudioFeedbackManager.swift */; };
		A1234567890123456789013E /* BasketballCoachAI.swift in Sources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789013F /* BasketballCoachAI.swift */; };
		A1234567890123456789014A /* Assets.xcassets in Resources */ = {isa = PBXBuildFile; fileRef = A1234567890123456789014B /* Assets.xcassets */; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		A1234567890123456789012A /* BasketballFormAnalyzer.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = BasketballFormAnalyzer.app; sourceTree = BUILT_PRODUCTS_DIR; };
		A1234567890123456789012B /* BasketballFormAnalyzerApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = BasketballFormAnalyzerApp.swift; sourceTree = "<group>"; };
		A1234567890123456789012D /* ContentView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ContentView.swift; sourceTree = "<group>"; };
		A1234567890123456789012F /* CameraManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = CameraManager.swift; sourceTree = "<group>"; };
		A1234567890123456789013B /* PoseAnalyzer.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = PoseAnalyzer.swift; sourceTree = "<group>"; };
		A1234567890123456789013D /* AudioFeedbackManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AudioFeedbackManager.swift; sourceTree = "<group>"; };
		A1234567890123456789013F /* BasketballCoachAI.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = BasketballCoachAI.swift; sourceTree = "<group>"; };
		A1234567890123456789014B /* Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; };
		A1234567890123456789014C /* Info.plist */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = Info.plist; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		A1234567890123456789012G /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		A1234567890123456789012H /* BasketballFormAnalyzer */ = {
			isa = PBXGroup;
			children = (
				A1234567890123456789012B /* BasketballFormAnalyzerApp.swift */,
				A1234567890123456789012D /* ContentView.swift */,
				A1234567890123456789012F /* CameraManager.swift */,
				A1234567890123456789013B /* PoseAnalyzer.swift */,
				A1234567890123456789013D /* AudioFeedbackManager.swift */,
				A1234567890123456789013F /* BasketballCoachAI.swift */,
				A1234567890123456789014B /* Assets.xcassets */,
				A1234567890123456789014C /* Info.plist */,
			);
			path = BasketballFormAnalyzer;
			sourceTree = "<group>";
		};
		A1234567890123456789012I /* Products */ = {
			isa = PBXGroup;
			children = (
				A1234567890123456789012A /* BasketballFormAnalyzer.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		A1234567890123456789012J = {
			isa = PBXGroup;
			children = (
				A1234567890123456789012H /* BasketballFormAnalyzer */,
				A1234567890123456789012I /* Products */,
			);
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		A1234567890123456789012K /* BasketballFormAnalyzer */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = A1234567890123456789012L /* Build configuration list for PBXNativeTarget "BasketballFormAnalyzer" */;
			buildPhases = (
				A1234567890123456789012M /* Sources */,
				A1234567890123456789012G /* Frameworks */,
				A1234567890123456789012N /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = BasketballFormAnalyzer;
			productName = BasketballFormAnalyzer;
			productReference = A1234567890123456789012A /* BasketballFormAnalyzer.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		A1234567890123456789012O /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 1500;
				TargetAttributes = {
					A1234567890123456789012K = {
						CreatedOnToolsVersion = 15.0;
					};
				};
			};
			buildConfigurationList = A1234567890123456789012P /* Build configuration list for PBXProject "BasketballFormAnalyzer" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = A1234567890123456789012J;
			productRefGroup = A1234567890123456789012I /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				A1234567890123456789012K /* BasketballFormAnalyzer */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		A1234567890123456789012N /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				A1234567890123456789014A /* Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		A1234567890123456789012M /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				A1234567890123456789012C /* ContentView.swift in Sources */,
				A1234567890123456789012A /* BasketballFormAnalyzerApp.swift in Sources */,
				A1234567890123456789012E /* CameraManager.swift in Sources */,
				A1234567890123456789013A /* PoseAnalyzer.swift in Sources */,
				A1234567890123456789013C /* AudioFeedbackManager.swift in Sources */,
				A1234567890123456789013E /* BasketballCoachAI.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		A1234567890123456789012Q /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG $(inherited)";
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			};
			name = Debug;
		};
		A1234567890123456789012R /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = wholemodule;
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		A1234567890123456789012S /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_ASSET_PATHS = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = BasketballFormAnalyzer/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.example.BasketballFormAnalyzer;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		A1234567890123456789012T /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_ASSET_PATHS = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = BasketballFormAnalyzer/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.example.BasketballFormAnalyzer;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		A1234567890123456789012L /* Build configuration list for PBXNativeTarget "BasketballFormAnalyzer" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				A1234567890123456789012S /* Debug */,
				A1234567890123456789012T /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		A1234567890123456789012P /* Build configuration list for PBXProject "BasketballFormAnalyzer" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				A1234567890123456789012Q /* Debug */,
				A1234567890123456789012R /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = A1234567890123456789012O /* Project object */;
}
EOF

    echo "✅ Project structure created successfully!"
}

echo "🔨 Building project..."
xcodebuild build -project BasketballFormAnalyzer.xcodeproj -scheme BasketballFormAnalyzer -destination 'platform=iOS Simulator,name=iPhone 15'

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To run on your iPhone:"
    echo "1. Connect your iPhone via USB"
    echo "2. Open BasketballFormAnalyzer.xcodeproj in Xcode"
    echo "3. Select your device from the scheme dropdown"
    echo "4. Press Cmd+R to build and run"
    echo ""
    echo "📱 To run on simulator:"
    echo "1. Open BasketballFormAnalyzer.xcodeproj in Xcode"
    echo "2. Select iPhone 15 Simulator"
    echo "3. Press Cmd+R to build and run"
else
    echo "❌ Build failed!"
    echo "Please check the error messages above."
    exit 1
fi 