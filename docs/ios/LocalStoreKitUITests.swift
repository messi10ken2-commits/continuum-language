// Copied into a disposable test target by prepare-local-storekit.mjs only.
import XCTest
import Foundation
import StoreKitTest
import StoreKit

final class LocalStoreKitUITests: XCTestCase {
    func testPurchaseCancelPendingAndRestoreScreens() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .portrait
        let session = try SKTestSession(configurationFileNamed: "ContinuumLocalTesting")
        session.resetToDefaultState()
        session.clearTransactions()
        session.disableDialogs = true
        defer { session.clearTransactions(); session.resetToDefaultState() }
        // Keep the UI driver synchronous on XCTest's main thread. Only the
        // StoreKitTest control API runs asynchronously, with an explicit deadline.
        func simulatedPurchaseError(_ failure: SKTestFailures.Purchase?) throws {
            let done = XCTestExpectation(description: "StoreKitTest purchase override")
            let result = StoreKitOverrideResult()
            let task = Task.detached {
                do { try await session.setSimulatedError(failure, forAPI: .purchase) }
                catch { result.set(error) }
                done.fulfill()
            }
            defer { task.cancel() }
            guard XCTWaiter.wait(for: [done], timeout: 20) == .completed else {
                throw NSError(domain: "ContinuumStoreKitUITest", code: 1, userInfo: [NSLocalizedDescriptionKey: "StoreKitTest purchase override timed out"])
            }
            if let error = result.read() { throw error }
        }
        // Fail before UI interaction if the simulator cannot reach the strictly
        // verified HTTPS fixture. Never bypass TLS to make this probe pass.
        let healthDone = XCTestExpectation(description: "Simulator HTTPS fixture")
        let healthResult = StoreKitOverrideResult()
        let healthRequest = URLRequest(url: URL(string: "https://127.0.0.1:9443/api/health")!, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 15)
        let healthTask = URLSession.shared.dataTask(with: healthRequest) { data, response, error in
            if let error = error {
                let value = error as NSError
                print("STOREKIT_FIXTURE_HTTPS_ERROR", value.domain, value.code, value.localizedDescription)
                healthResult.set(error)
            } else if (response as? HTTPURLResponse)?.statusCode != 200 ||
                ((try? JSONSerialization.jsonObject(with: data ?? Data())) as? [String: Any])?["ok"] as? Bool != true {
                healthResult.set(NSError(domain: "ContinuumStoreKitUITest", code: 2, userInfo: [NSLocalizedDescriptionKey: "Simulator fixture health response was invalid"]))
            } else { print("STOREKIT_FIXTURE_HTTPS_OK") }
            healthDone.fulfill()
        }
        healthTask.resume()
        guard XCTWaiter.wait(for: [healthDone], timeout: 20) == .completed else {
            healthTask.cancel()
            throw NSError(domain: "ContinuumStoreKitUITest", code: 3, userInfo: [NSLocalizedDescriptionKey: "Simulator fixture HTTPS probe timed out"])
        }
        if let error = healthResult.read() { throw error }
        let app = XCUIApplication(bundleIdentifier: "com.continuum.language.dev")
        app.launch()
        // The scheme loads its StoreKit configuration during app launch.
        // Apply automation overrides after that configuration has been loaded.
        session.disableDialogs = true
        XCTAssertTrue(session.disableDialogs)
        func reveal(_ element: XCUIElement, bottomNavigation: Bool = false) -> Bool {
            let bottom: CGFloat = bottomNavigation ? 20 : 100
            let safeFrame = CGRect(x: app.frame.minX + 12, y: app.frame.minY + 100, width: app.frame.width - 24, height: app.frame.height - 100 - bottom)
            for attempt in 0..<32 {
                let frame = element.frame
                let keyboard = app.keyboards.firstMatch
                if frame.width > 0 && frame.height > 0 && element.isHittable &&
                    safeFrame.contains(CGPoint(x: frame.midX, y: frame.midY)) &&
                    (!keyboard.exists || !frame.intersects(keyboard.frame)) { return true }
                // Short window gestures can correct either overscroll direction.
                // Offscreen WebKit zero frames use a bounded bidirectional scan.
                let down = frame.height > 0 ? frame.midY < safeFrame.minY : attempt >= 16
                let start = app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: down ? 0.38 : 0.62))
                let end = app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: down ? 0.56 : 0.44))
                start.press(forDuration: 0.05, thenDragTo: end)
            }
            return false
        }
        func tap(_ title: String) {
            let matches = app.webViews.buttons.matching(NSPredicate(format: "label == %@", title))
            XCTAssertTrue(matches.firstMatch.waitForExistence(timeout: 90), title)
            let button = matches.element(boundBy: max(0, matches.count - 1))
            let enabled = XCTNSPredicateExpectation(predicate: NSPredicate(format: "enabled == true"), object: button)
            XCTAssertEqual(XCTWaiter.wait(for: [enabled], timeout: 20), .completed, "Button must be ready: " + title)
            guard reveal(button, bottomNavigation: title == "Account") else {
                let failure = XCTAttachment(screenshot: app.screenshot()); failure.name = "StoreKit-obstructed-" + title; failure.lifetime = .keepAlways; add(failure)
                print("STOREKIT_ACCESSIBILITY", app.debugDescription)
                XCTFail("Button obstructed: " + title); return
            }
            button.tap()
        }
        func status(_ text: String, capture: String) {
            let label = app.webViews.staticTexts[text]
            guard label.waitForExistence(timeout: 40), reveal(label) else {
                let failure = XCTAttachment(screenshot: app.screenshot()); failure.name = "StoreKit-missing-" + capture; failure.lifetime = .keepAlways; add(failure)
                print("STOREKIT_FAILED_STATUS_ACCESSIBILITY", app.debugDescription)
                XCTFail("Result must exist and be visible: " + text); return
            }
            let image = XCTAttachment(screenshot: app.screenshot()); image.name = capture; image.lifetime = .keepAlways; add(image)
        }
        tap("Already a member? Sign in")
        let email = app.webViews.textFields["Email"]
        XCTAssertTrue(email.waitForExistence(timeout: 20))
        email.tap(); email.typeText("store-demo@example.test")
        let password = app.webViews.secureTextFields.firstMatch
        password.tap(); password.typeText("store-demo-fixture-123")
        tap("Sign in"); tap("Account")
        tap("Load local products")
        status("Local products loaded: 2", capture: "StoreKit-01-Products")
        tap("Restore local purchases")
        status("No local purchases to restore.", capture: "StoreKit-02-EmptyRestore")
        session.disableDialogs = true
        XCTAssertTrue(session.disableDialogs)
        tap("Buy local monthly")
        status("Local purchase succeeded. No access granted.", capture: "StoreKit-03-Purchase")
        XCTAssertFalse(session.allTransactions().isEmpty)
        tap("Restore local purchases")
        status("Local purchases restored: 1. No access granted.", capture: "StoreKit-04-Restore")
        session.clearTransactions()
        session.askToBuyEnabled = true
        tap("Buy local monthly")
        status("Local purchase pending. No access granted.", capture: "StoreKit-05-Pending")
        session.clearTransactions(); session.askToBuyEnabled = false
        session.disableDialogs = true
        // Apple's StoreKitTest injects the cancellation in the native purchase API.
        // This verifies app response UI; it does not claim a physical system-sheet tap.
        try simulatedPurchaseError(.generic(.userCancelled))
        tap("Buy local monthly")
        status("Local purchase cancelled. No access granted.", capture: "StoreKit-06-NativeCancellation")
        try simulatedPurchaseError(nil)
        tap("Restore local purchases")
        status("No local purchases to restore.", capture: "StoreKit-07-CancelPreservesEmpty")
    }
}

private final class StoreKitOverrideResult: @unchecked Sendable {
    private let lock = NSLock()
    private var error: Error?
    func set(_ value: Error) { lock.lock(); defer { lock.unlock() }; error = value }
    func read() -> Error? { lock.lock(); defer { lock.unlock() }; return error }
}
