/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "platform/ios/CCEAGLView-ios.h"

#import "cocos-analytics/CAAgent.h"

#import <JavaScriptCore/JavaScriptCore.h>
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#import "Definitions.h"
#include "DeviceUtil.h"
#include "DeviceUID.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>

#import <Firebase.h>
#import "Reachability.h"

using namespace cocos2d;

@implementation AppController

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate* s_sharedApplication = nullptr;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[UIApplication sharedApplication] setIdleTimerDisabled: YES];
    
    [OneSignal initWithLaunchOptions:launchOptions
                               appId:OneSignalAppID
            handleNotificationAction:nil
                            settings:@{kOSSettingsKeyAutoPrompt: @false}];
    OneSignal.inFocusDisplayType = OSNotificationDisplayTypeNotification;
    [OneSignal promptForPushNotificationsWithUserResponse:^(BOOL accepted) {
        NSLog(@"User accepted notifications: %d", accepted);
    }];
    
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
    
    
    [CAAgent enableDebug:NO];
    
    if (s_sharedApplication == nullptr)
    {
        s_sharedApplication = new (std::nothrow) AppDelegate();
    }
    cocos2d::Application *app = cocos2d::Application::getInstance();
    
    // Initialize the GLView attributes
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();
    
    // Override point for customization after application launch.
    
    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
    _viewController.wantsFullScreenLayout = YES;
    
    
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    
    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)_viewController.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    [FIRApp configure];
    
    //run the cocos2d-x game scene
    app->run();
    
    return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                  openURL:url
                                                        sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                               annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                    ];
    // Add any custom logic here.
    return handled;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->pause(); */
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->resume(); */
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
    if (CAAgent.isInited) {
        [CAAgent onPause];
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    auto glview = (__bridge CCEAGLView*)(Director::getInstance()->getOpenGLView()->getEAGLView());
    auto currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
    if (glview == currentView) {
        cocos2d::Application::getInstance()->applicationWillEnterForeground();
    }
    if (CAAgent.isInited) {
        [CAAgent onResume];
    }
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
     Called when the application is about to terminate.
     See also applicationDidEnterBackground:.
     */
    if (s_sharedApplication != nullptr)
    {
        delete s_sharedApplication;
        s_sharedApplication = nullptr;
    }
    [CAAgent onDestroy];
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}


#if __has_feature(objc_arc)
#else
- (void)dealloc {
    [window release];
    [_viewController release];
    [super dealloc];
}
#endif

-(void)onCallToNativeJS:(NSString*)evt andParams:(NSString*)params{
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", evt, params];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

+ (void) onCallFromJavaScript:(NSString *) evt andParams:(NSString *)params {
    //    NSLog(@"test call ios: %@ - %@", evt, params);
    if ([evt isEqualToString:GET_DEVICE_ID]) { // device id
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_DEVICE_ID andParams:[DeviceUID uid]];
    }
    else if ([evt isEqualToString:GET_BUNDLE_ID]) { // bundle id
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_BUNDLE_ID andParams:[[NSBundle mainBundle] bundleIdentifier]];
    }
    else if ([evt isEqualToString:GET_VERSION_ID]) { // version
        //        NSString *bundleID = [[NSBundle mainBundle] bundleIdentifier];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:evt andParams:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
    }
    else if ([evt isEqualToString:LOGIN_FACEBOOK]) { // login face
        //        NSInteger *relogin = [params integerValue];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController LoginFacebook:0];
    }
    else if ([evt isEqualToString:GET_PATH_FOR_SCREENSHOT]) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                             NSUserDomainMask, YES);
        
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *dataPath =
        [documentsDirectory stringByAppendingPathComponent:@"/Screenshot"];
        if (![[NSFileManager defaultManager] fileExistsAtPath:dataPath])
            [[NSFileManager defaultManager] createDirectoryAtPath:dataPath
                                      withIntermediateDirectories:YES
                                                       attributes:nil
                                                            error:nil];
        
        NSString *filePath =
        [NSString stringWithFormat:@"%@/%@", dataPath, @"screenshot.png"];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_PATH_FOR_SCREENSHOT andParams:filePath];
    }
    else if ([evt isEqualToString:VERIFY_PHONE]) { // verify
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController.viewController callVerifyPhoneNumber:@"phone"];
    }
    else if ([evt isEqualToString:CHAT_ADMIN]) { // chat admin
    }
    else if ([evt isEqualToString:DEVICE_VERSION]) { // device version
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:DEVICE_VERSION andParams:[[UIDevice currentDevice] systemVersion]];
    }
    else if ([evt isEqualToString:SHARE_FACEBOOK]) { // share image face
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *path = [NSString stringWithFormat:@"%@", [json objectForKey:@"path"]];
        NSString *hasTag = [NSString stringWithFormat:@"%@", [json objectForKey:@"hasTag"]];
        
        UIImage *screenshot = [UIImage imageWithData:[NSData dataWithContentsOfFile:path]];
        AppController* appController = (AppController*)[[UIApplication sharedApplication] delegate];
        [appController.viewController shareScreenshotFacebook:screenshot withHastag:hasTag];
    }
    else if ([evt isEqualToString:LOG_EVENT_TRACKING]) { // tracking
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSArray *arr = [json objectForKey:@"param"];
        
        if([arr count] > 0){
            @try{
                NSUInteger si = [arr count];
                NSString *event = [arr objectAtIndex:0];
                
                //                NSLog(@"=====>event: %@", event);
                if([arr count] > 2){
                    NSMutableDictionary *myMuDic = [[NSMutableDictionary alloc] init];
                    
                    NSString *strTemp = [arr objectAtIndex:si - 1];
                    NSArray *testArray = [[NSArray alloc] init];
                    testArray = [strTemp componentsSeparatedByString:@","];
                    
                    for(int i = 1; i < si - 1; i++){
                        //                        NSLog(@"=====>value: %@  key: %@", [arr objectAtIndex:i], [testArray objectAtIndex:i-1]);
                        [myMuDic setObject:[arr objectAtIndex:i] forKey:[testArray objectAtIndex:i-1]];
                    }
                    
                    [FIRAnalytics logEventWithName:event parameters:myMuDic];
                }
            }@catch(NSException *e){
                //                NSLog(@"Exception sendLogEvent: %@", e);
            }
        }
    }
    else if ([evt isEqualToString:BUY_IAP]) { // iap
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController buyIAP:params];
    }
    else if ([evt isEqualToString:SHARE_CODE_MESSAGE]) { // share code message
        NSString *sms = [NSString stringWithFormat:@"sms:&body=%@", params];
        NSString *url = [sms stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
    }
    else if ([evt isEqualToString:SEND_TAG_ONESIGNAL]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *key = [json objectForKey:@"key"];
        NSString *value = [json objectForKey:@"value"];
        
        //        NSLog(@"send One: \n--> Key: %@\n--> Value: %@", key, value);
        [OneSignal sendTag:key value:value];
    }
    else if ([evt isEqualToString:OPEN_FANPAGE]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *pageId = [json objectForKey:@"pageID"];
        NSString *pageUrl = [json objectForKey:@"pageUrl"];
        
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController openFanpageFB:pageId orOpenWithURL:pageUrl];
    }
    else if ([evt isEqualToString:OPEN_GROUP]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *groupId = [json objectForKey:@"groupID"];
        NSString *groupUrl = [json objectForKey:@"groupUrl"];
        
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController openGroupFB:groupId orOpenWithURL:groupUrl];
    }
    else if ([evt isEqualToString:CHECK_NETWORK]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController checkNetwork];
    }
    else if ([evt isEqualToString:PUSH_NOTI_OFFLINE]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *title = [json objectForKey:@"title"];
        NSInteger value_time = [[json objectForKey:@"time"] integerValue];
        NSString *content = [json objectForKey:@"content"];
        
        AppController* appController = (AppController*)[[UIApplication sharedApplication] delegate];
        [appController.viewController showNoti:title
                                   withMessage:content
                                  withCategory:@"null"
                                withIdentifier:@"null"
                                withTimeSecond:value_time];
    }
    else if ([evt isEqualToString:CARRIER_NAME]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController getCarrierName];
    }
    else if ([evt isEqualToString:GET_API_AVAILABLE]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController getAPI_AVAILABLE];
    }
    else if([evt isEqualToString:SIGN_WITH_APPLE_ID]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController signWithAppleID];
    }
}

- (void)LoginFacebook:(NSInteger)reLogin{
    
    NSString * tokenFB = [FBSDKAccessToken currentAccessToken].tokenString;
    //    NSLog(@"token = %@", tokenFB);
    if (tokenFB == nil || reLogin == 1) {
        NSArray *permissionsArray = @[@"public_profile", @"email"];
        FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
        [login
         logInWithPermissions: permissionsArray
         fromViewController:self.viewController
         handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
             if (error) {
                 NSLog(@"Process error");
             } else if (result.isCancelled) {
                 NSLog(@"Cancelled");
             } else {
                 NSLog(@"Logged in");
                 NSString *a_token = [FBSDKAccessToken currentAccessToken].tokenString;
                 AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
                 [appController onCallToNativeJS:LOGIN_FACEBOOK andParams:a_token];
             }
         }];
    }
    else {
        NSString *a_token = [FBSDKAccessToken currentAccessToken].tokenString;
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:LOGIN_FACEBOOK andParams:a_token];
    }
    
}

- (void)gameRequestDialog:(nonnull FBSDKGameRequestDialog *)gameRequestDialog didCompleteWithResults:(nonnull NSDictionary<NSString *,id> *)results {
    NSLog(@"=-=-=-===== results: %@ ", results);
}

- (void)gameRequestDialog:(nonnull FBSDKGameRequestDialog *)gameRequestDialog didFailWithError:(nonnull NSError *)error {
    NSLog(@"=-=-=-===== results: %@ ", error);
}

- (void)gameRequestDialogDidCancel:(nonnull FBSDKGameRequestDialog *)gameRequestDialog {
    NSLog(@"=-=-=-===== results: Cancel ");
}

-(void)buyIAP:(NSString*)productID{
    AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
    [appController.viewController buyProduct:productID];
}

-(void)openFanpageFB:(NSString*) fanpageID  orOpenWithURL:(NSString*) fanpageURL{
    NSString *surl = [NSString stringWithFormat:@"%s%@", "fb://profile/", fanpageID];
    NSURL *url = [NSURL URLWithString:surl];
    //    NSLog(@"open app facebook: %@", surl);
    if([[UIApplication sharedApplication] canOpenURL:url]){
        [[UIApplication sharedApplication] openURL:url];
    }else{
        NSURL *linkUrl = [NSURL URLWithString:fanpageURL];
        [[UIApplication sharedApplication] openURL:linkUrl];
    }
}

-(void)openGroupFB:(NSString*) groupID  orOpenWithURL:(NSString*) groupURL{
    [self openFanpageFB:groupID orOpenWithURL:groupURL];
}

-(void)checkNetwork {
    Reachability *myNetwork = [Reachability reachabilityWithHostname:@"google.com"];
    NetworkStatus myStatus = [myNetwork currentReachabilityStatus];
    
    switch (myStatus) {
        case NotReachable:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"-1"];
            break;
        }
        case ReachableViaWWAN:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"3G"];
            break;
        }
        case ReachableViaWiFi:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"Wifi"];
            break;
        }
        default:
            break;
    }
}

-(void)getCarrierName
{
    CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
    CTCarrier *carrier = [netinfo subscriberCellularProvider];
    
    int countryCode = [carrier.mobileCountryCode intValue];
    int networkCode = [carrier.mobileNetworkCode intValue];
    //    countryCode = 456;
    NSString *strcountryCode =
    [NSString stringWithFormat:@"%d", countryCode];
    
    AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
    [appController onCallToNativeJS:CARRIER_NAME andParams:strcountryCode];
    
    //    if (countryCode == 456){
    //        return 1;//Cam
    //    }else if (countryCode == 457){
    //        return 2;//Lao
    //    }
    //    return 0;
    
    //    if (countryCode == 520) {
    //        if (networkCode == 1 || networkCode == 3 || networkCode == 23) {
    //            //mb
    //            //            NSLog(@"\n\nAIS");
    //            return 3;
    //        }
    //        else if (networkCode == 5 || networkCode == 18) {
    //            //vn
    //            //            NSLog(@"\n\nDTAC");
    //            return 2;
    //        }
    //        else if (networkCode == 4 || networkCode == 99) {
    //            //vt
    //            //            NSLog(@"\n\nTRUE");
    //            return 1;
    //        }
    //        else
    //        {
    //
    //        }
    //    }
}

-(void)signWithAppleID{
    CCLOG("---->IOS signWithAppleID");
    if (@available(iOS 13.0, *)) {
        ASAuthorizationAppleIDRequest *request = [[[ASAuthorizationAppleIDProvider alloc] init] createRequest];
        request.requestedScopes = @[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail];
        
        ASAuthorizationController *authController = [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];
        authController.delegate = self;
        authController.presentationContextProvider = self;
        [authController performRequests];
    } else {
        // Fallback on earlier versions
        CCLOG("---->IOS LÊU LÊU DÙNG IOS CÙI MÀ CŨNG BẮT CHƯỚC!!!");
    }
}

-(bool)getAPI_AVAILABLE{
    CCLOG("---->IOS getAPI_AVAILABLE");
    if (@available(iOS 13.0, *)) {
        return true;
    }else
        return false;
}

- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithAuthorization:(ASAuthorization *)authorization  API_AVAILABLE(ios(13.0)){
    
    CCLOG("---->IOS authorizationController");
    //    NSLog(@"--->IOS %s", __FUNCTION__);
    //    NSLog(@"--->IOS %@", controller);
    //    NSLog(@"--->IOS %@", authorization);
    //    NSLog(@"--->IOS authorization.credential：%@", authorization.credential);
    if ([authorization.credential isKindOfClass:[ASAuthorizationAppleIDCredential class]]) {
        ASAuthorizationAppleIDCredential *appleIDCredential = authorization.credential;
        NSString *identityToken = [[NSString alloc] initWithData:appleIDCredential.identityToken encoding:NSUTF8StringEncoding];
        NSString *user = appleIDCredential.user;
        NSString *familyName = appleIDCredential.fullName.familyName;
        NSString *givenName = appleIDCredential.fullName.givenName;
        NSString *email = appleIDCredential.email;
        
        
        std::string strUser = user == nil ? "" : [user UTF8String];
        std::string strEmail = email == nil ? "" : [email UTF8String];
        std::string strfamilyName = familyName == nil ? "" : [familyName UTF8String];
        std::string strgivenName = givenName == nil ? "" : [givenName UTF8String];
        std::string strIdentityToken = identityToken == nil ? "" : [identityToken UTF8String];
        CCLOG("---->IOS strUser %s", strUser.c_str());
        CCLOG("---->IOS strEmail %s", strEmail.c_str());
        CCLOG("---->IOS strfamilyName %s", strfamilyName.c_str());
        CCLOG("---->IOS strgivenName %s", strgivenName.c_str());
        CCLOG("---->IOS identityToken %s", strIdentityToken.c_str());

        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:SIGN_WITH_APPLE_ID andParams:identityToken];

    } else if ([authorization.credential isKindOfClass:[ASPasswordCredential class]]) {
        ASPasswordCredential *passwordCredential = authorization.credential;
        NSString *user = passwordCredential.user;
        NSString *password = passwordCredential.password;
        
        std::string strUser = user == nil ? "" : [user UTF8String];
        std::string strPassword = password == nil ? "" : [password UTF8String];
        
        CCLOG("---->IOS strUser %s", strUser.c_str());
        CCLOG("---->IOS strEmail %s", strPassword.c_str());
    } else {
        //         NSLog(@"--->IOS  HAHAA");
    }
}
- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithError:(NSError *)error  API_AVAILABLE(ios(13.0)){
    //    NSLog(@"%s", __FUNCTION__);
    //    NSLog(@"--->IOS error ：%@", error);
    
    CCLOG("---->IOS authorizationController %ld", (long)error.code);
    NSString *errorMsg = nil;
    switch (error.code) {
        case ASAuthorizationErrorCanceled:
            errorMsg = @"ASAuthorizationErrorCanceled";
            break;
        case ASAuthorizationErrorFailed:
            errorMsg = @"ASAuthorizationErrorFailed";
            break;
        case ASAuthorizationErrorInvalidResponse:
            errorMsg = @"ASAuthorizationErrorInvalidResponse";
            break;
        case ASAuthorizationErrorNotHandled:
            errorMsg = @"ASAuthorizationErrorNotHandled";
            break;
        case ASAuthorizationErrorUnknown:
            errorMsg = @"ASAuthorizationErrorUnknown";
            break;
    }
    
    NSLog(@"--->IOS errorMsg controller requests：%@", errorMsg);
    std::string str = [errorMsg UTF8String];
    if (errorMsg) {
        return;
    }
    NSLog(@"--->IOS controller requests：%@", controller.authorizationRequests);
}

@end
