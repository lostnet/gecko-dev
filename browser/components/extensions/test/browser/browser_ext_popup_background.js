/* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set sts=2 sw=2 et tw=80: */
/* eslint-disable mozilla/no-arbitrary-setTimeout */
"use strict";

async function testPanel(browser, standAlone, initial_background) {
  let panel = getPanelForNode(browser);

  let checkBackground = (background = null) => {
    if (background == null || !standAlone) {
      return;
    }

    is(
      getComputedStyle(panel.panelContent).backgroundColor,
      background,
      "Content should have correct background"
    );
  };

  function getBackground(browser) {
    return SpecialPowers.spawn(browser, [], async function() {
      return content.getComputedStyle(content.document.body).backgroundColor;
    });
  }

  let setBackground = color => {
    content.document.body.style.backgroundColor = color;
  };

  await new Promise(resolve => setTimeout(resolve, 100));

  info("Test that initial background color is applied");
  checkBackground(initial_background);

  info("Test that dynamically-changed background color is applied");
  await alterContent(browser, setBackground, "black");
  checkBackground(await getBackground(browser));

  info("Test that non-opaque background color results in default styling");
  await alterContent(browser, setBackground, "rgba(1, 2, 3, .9)");
}

add_task(async function testPopupBackground() {
  let testCases = [
    {
      browser_style: false,
      background: "background-color: green;",
      initial_background: "rgb(0, 128, 0)",
    },
    {
      browser_style: true,
      // Use white here instead of transparent, because
      // when no background is supplied we will fill
      // with white by default.
      initial_background: "rgb(255, 255, 255)",
    },
  ];
  for (let testCase of testCases) {
    info(
      `Testing browser_style: ${
        testCase.browser_style
      } with background? ${!!testCase.background}`
    );
    let extension = ExtensionTestUtils.loadExtension({
      background() {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
          browser.pageAction.show(tabs[0].id);
        });
      },

      manifest: {
        browser_action: {
          default_popup: "popup.html",
          browser_style: testCase.browser_style,
        },

        page_action: {
          default_popup: "popup.html",
          browser_style: testCase.browser_style,
        },
      },

      files: {
        "popup.html": `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="width: 100px; height: 100px; ${testCase.background ||
              ""}">
            </body>
          </html>`,
      },
    });

    await extension.startup();

    {
      info("Test stand-alone browserAction popup");

      clickBrowserAction(extension);
      let browser = await awaitExtensionPanel(extension);
      await testPanel(browser, true, testCase.initial_background);
      await closeBrowserAction(extension);
    }

    {
      info("Test menu panel browserAction popup");

      let widget = getBrowserActionWidget(extension);
      CustomizableUI.addWidgetToArea(widget.id, getCustomizableUIPanelID());

      clickBrowserAction(extension);
      let browser = await awaitExtensionPanel(extension);
      await testPanel(browser, false, testCase.initial_background);
      await closeBrowserAction(extension);
    }

    {
      info("Test pageAction popup");

      clickPageAction(extension);
      let browser = await awaitExtensionPanel(extension);
      await testPanel(browser, true, testCase.initial_background);
      await closePageAction(extension);
    }

    await extension.unload();
  }
});
