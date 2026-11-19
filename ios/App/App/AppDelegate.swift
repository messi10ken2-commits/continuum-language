import UIKit
import Capacitor
import Security
import AVFAudio
import StoreKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
    }
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

// Registered explicitly; credentials never enter UserDefaults or web storage.
class ContinuumViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(ContinuumNativePlugin())
    }
}

@objc(ContinuumNativePlugin)
public class ContinuumNativePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ContinuumNativePlugin"
    public let jsName = "ContinuumNative"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "remoteCapabilities", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "prepareAudio", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "releaseAudio", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manageSubscriptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "finishTransaction", returnType: CAPPluginReturnPromise)
    ]
    private var observers: [NSObjectProtocol] = []
    private func sessionKeychain(_ call: CAPPluginCall) -> [String: Any]? {
        guard let origin = call.getString("origin"), let url = URLComponents(string: origin),
              url.scheme == "https", url.host != nil, url.user == nil, url.password == nil,
              url.query == nil, url.fragment == nil, url.path.isEmpty else { return nil }
        return
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: Bundle.main.bundleIdentifier ?? "com.continuum.language.dev",
         kSecAttrAccount as String: "continuum-session:" + origin]
    }
    public override func load() {
        observers.append(NotificationCenter.default.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { [weak self] event in
            guard let value = event.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
                  value == AVAudioSession.InterruptionType.began.rawValue else { return }
            self?.notifyListeners("audioInterrupted", data: [:])
        })
        observers.append(NotificationCenter.default.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { [weak self] event in
            guard let value = event.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
                  value == AVAudioSession.RouteChangeReason.oldDeviceUnavailable.rawValue || value == AVAudioSession.RouteChangeReason.newDeviceAvailable.rawValue else { return }
            self?.notifyListeners("audioInterrupted", data: [:])
        })
    }
    deinit { observers.forEach { NotificationCenter.default.removeObserver($0) } }
    @objc func remoteCapabilities(_ call: CAPPluginCall) {
        call.resolve(["push": Bundle.main.object(forInfoDictionaryKey: "ContinuumRemotePushEnabled") as? Bool ?? false,
                      "bundle": Bundle.main.bundleIdentifier ?? "",
                      "environment": Bundle.main.object(forInfoDictionaryKey: "ContinuumAPNSEnvironment") as? String ?? "Sandbox"])
    }
    @objc func readSession(_ call: CAPPluginCall) {
        guard let keychain = sessionKeychain(call) else { call.reject("Invalid session origin"); return }
        var query = keychain; query[kSecReturnData as String] = true; query[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        if status == errSecItemNotFound { call.resolve([:]); return }
        #if DEBUG
        if status != errSecSuccess { print("Continuum Keychain read OSStatus", status) }
        #endif
        guard status == errSecSuccess, let data = item as? Data, let token = String(data: data, encoding: .utf8) else { call.reject("Secure session storage is unavailable"); return }
        call.resolve(["token": token])
    }
    @objc func saveSession(_ call: CAPPluginCall) {
        guard let keychain = sessionKeychain(call) else { call.reject("Invalid session origin"); return }
        guard let token = call.getString("token"), token.range(of: "^[A-Za-z0-9_-]{43}$", options: .regularExpression) != nil else { call.reject("Invalid session"); return }
        var item = keychain; item[kSecValueData as String] = Data(token.utf8)
        item[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        let status = SecItemUpdate(keychain as CFDictionary, [kSecValueData as String: Data(token.utf8)] as CFDictionary)
        if status == errSecItemNotFound {
            guard SecItemAdd(item as CFDictionary, nil) == errSecSuccess else { call.reject("Could not save secure session"); return }
        } else if status != errSecSuccess { call.reject("Could not update secure session"); return }
        call.resolve()
    }
    @objc func clearSession(_ call: CAPPluginCall) {
        guard let keychain = sessionKeychain(call) else { call.reject("Invalid session origin"); return }
        let status = SecItemDelete(keychain as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else { call.reject("Could not clear secure session"); return }
        call.resolve()
    }
    @objc func prepareAudio(_ call: CAPPluginCall) {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
            try session.setActive(true)
            call.resolve()
        } catch { call.reject("Could not prepare microphone audio", nil, error) }
    }
    @objc func releaseAudio(_ call: CAPPluginCall) {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setActive(false, options: .notifyOthersOnDeactivation)
            try session.setCategory(.playback)
            call.resolve()
        } catch { call.reject("Could not release microphone audio", nil, error) }
    }
    private let productIDs = ["com.continuum.premium.monthly", "com.continuum.premium.yearly"]
    @objc func products(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: productIDs)
                call.resolve(["products": products.map { ["id": $0.id, "name": $0.displayName, "price": $0.displayPrice] }, "purchasesEnabled": false])
            } catch { call.reject("Store products unavailable", nil, error) }
        }
    }
    @objc func purchase(_ call: CAPPluginCall) {
        // Never activate real payments by changing a JS flag. Approval and a reviewed
        // production verifier are required before removing this native release gate.
        #if DEBUG
        guard Bundle.main.object(forInfoDictionaryKey: "ContinuumLocalStoreKitTesting") as? Bool == true else { call.reject("StoreKit purchases are not enabled"); return }
        guard let id = call.getString("productId"), productIDs.contains(id), let account = UUID(uuidString: call.getString("accountToken") ?? "") else { call.reject("Invalid store purchase"); return }
        Task {
            do {
                guard #available(iOS 16.0, *) else { call.reject("Local StoreKit testing requires iOS 16 or later"); return }
                let app = try await AppTransaction.shared
                guard case .verified(let appTransaction) = app, appTransaction.environment == .xcode else { call.reject("Only the local Xcode StoreKit environment is allowed"); return }
                guard let product = try await Product.products(for: [id]).first else { call.reject("Product unavailable"); return }
                switch try await product.purchase(options: [.appAccountToken(account)]) {
                case .success(let result):
                    guard case .verified(let transaction) = result else { call.reject("Unverified store transaction"); return }
                    // Do not finish or grant access before the server verifies ownership.
                    call.resolve(["transactionId": String(transaction.id), "environment": "local-testing"])
                case .pending: call.resolve(["pending": true])
                case .userCancelled: call.resolve(["cancelled": true])
                @unknown default: call.reject("Unknown store purchase state")
                }
            } catch { call.reject("Store purchase failed", nil, error) }
        }
        #else
        call.reject("Live purchases await approved StoreKit configuration")
        #endif
    }
    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                var ids: [String] = []
                for await result in StoreKit.Transaction.currentEntitlements {
                    if case .verified(let tx) = result, productIDs.contains(tx.productID) { ids.append(String(tx.id)) }
                }
                call.resolve(["transactionIds": ids])
            } catch { call.reject("Restore purchases failed", nil, error) }
        }
    }
    @objc func manageSubscriptions(_ call: CAPPluginCall) {
        Task { @MainActor in
            guard let scene = self.bridge?.viewController?.view.window?.windowScene else { call.reject("App window unavailable"); return }
            do { try await AppStore.showManageSubscriptions(in: scene); call.resolve() }
            catch { call.reject("Subscription settings unavailable", nil, error) }
        }
    }
    @objc func finishTransaction(_ call: CAPPluginCall) {
        guard let id = call.getString("transactionId") else { call.reject("Missing transaction"); return }
        Task {
            for await result in StoreKit.Transaction.unfinished {
                if case .verified(let tx) = result, String(tx.id) == id { await tx.finish(); call.resolve(); return }
            }
            call.resolve()
        }
    }
}
