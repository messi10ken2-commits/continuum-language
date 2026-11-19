// Copied into a disposable test target by prepare-local-storekit.mjs only.
import XCTest
import StoreKitTest

final class LocalStoreKitUITests: XCTestCase {
    func testPurchaseCancelPendingAndRestoreScreens() throws {
        continueAfterFailure = false
        let session = try SKTestSession(configurationFileNamed: "ContinuumLocalTesting")
        session.resetToDefaultState()
        session.clearTransactions()
        session.disableDialogs = true
        defer { session.clearTransactions(); session.resetToDefaultState() }
        let app = XCUIApplication(bundleIdentifier: "com.continuum.language.dev")
        app.launch()
        func tap(_ title: String) {
            let button = app.webViews.buttons.matching(NSPredicate(format: "label == %@", title)).firstMatch
            XCTAssertTrue(button.waitForExistence(timeout: 90), title)
            for _ in 0..<20 {
                if button.isHittable && (!app.keyboards.firstMatch.exists || !button.frame.intersects(app.keyboards.firstMatch.frame)) { button.tap(); return }
                app.webViews.firstMatch.swipeUp()
            }
            XCTFail("Button obstructed: \(title)")
        }
        func status(_ text: String, capture: String) {
            XCTAssertTrue(app.webViews.staticTexts[text].waitForExistence(timeout: 40), text)
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
        XCTAssertTrue(session.allTransactions().isEmpty)
        session.disableDialogs = true
        tap("Restore local purchases")
        status("No local purchases to restore.", capture: "StoreKit-07-CancelPreservesEmpty")
    }
}
