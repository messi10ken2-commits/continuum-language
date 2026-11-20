// Copied into a disposable test target by prepare-local-storekit.mjs only.
import XCTest
import StoreKitTest

final class LocalStoreKitUITests: XCTestCase {
    func testPurchaseCancelPendingAndRestoreScreens() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .portrait
        let session = try SKTestSession(configurationFileNamed: "ContinuumLocalTesting")
        session.resetToDefaultState()
        session.clearTransactions()
        session.disableDialogs = true
        defer { session.clearTransactions(); session.resetToDefaultState() }
        let app = XCUIApplication(bundleIdentifier: "com.continuum.language.dev")
        app.launch()
        func tap(_ title: String) {
            let matches = app.webViews.buttons.matching(NSPredicate(format: "label == %@", title))
            XCTAssertTrue(matches.firstMatch.waitForExistence(timeout: 90), title)
            let button = matches.element(boundBy: max(0, matches.count - 1))
            for attempt in 0..<24 {
                let frame = button.frame
                let keyboard = app.keyboards.firstMatch
                if button.isHittable && frame.width > 0 && frame.height > 0 && app.frame.contains(CGPoint(x: frame.midX, y: frame.midY)) && (!keyboard.exists || !frame.intersects(keyboard.frame)) { button.tap(); return }
                // Offscreen WebKit accessibility frames can be zero: never infer a
                // direction from them. Use bounded scans in both directions on the
                // actual window, not the potentially content-sized WebView frame.
                if attempt < 12 { app.swipeUp(velocity: .fast) }
                else { app.swipeDown(velocity: .fast) }
            }
            let failure = XCTAttachment(screenshot: app.screenshot()); failure.name = "StoreKit-obstructed-" + title; failure.lifetime = .keepAlways; add(failure)
            print("STOREKIT_ACCESSIBILITY", app.debugDescription)
            XCTFail("Button obstructed: \(title)")
        }
        func status(_ text: String, capture: String) {
            let label = app.webViews.staticTexts[text]
            XCTAssertTrue(label.waitForExistence(timeout: 40), text)
            for _ in 0..<12 { if label.isHittable { break }; app.swipeUp(velocity: .fast) }
            XCTAssertTrue(label.isHittable, "Result must be visible: \(text)")
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
        session.disableDialogs = false
        tap("Buy local monthly")
        // Cancel the real local StoreKit confirmation sheet, rather than synthesizing a JS result.
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let appCancel = app.buttons["Cancel"]
        let systemCancel = springboard.buttons["Cancel"]
        if appCancel.waitForExistence(timeout: 15) { appCancel.tap() }
        else { XCTAssertTrue(systemCancel.waitForExistence(timeout: 15)); systemCancel.tap() }
        status("Local purchase cancelled. No access granted.", capture: "StoreKit-06-Cancel")
        session.disableDialogs = true
        tap("Restore local purchases")
        status("No local purchases to restore.", capture: "StoreKit-07-CancelPreservesEmpty")
    }
}
