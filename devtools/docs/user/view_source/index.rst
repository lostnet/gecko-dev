===========
View Source
===========

View Source lets you look at the HTML or XML source for the page you're viewing. To activate View Source:

- context-click in the page and select *View Page Source*
- press :kbd:`Ctrl` + :kbd:`U` on Windows and Linux, or :kbd:`Cmd` + :kbd:`U` on macOS

The command opens a new tab with the source for the current page.

View Source features
********************

View Source has three additional features, which can be accessed from the context menu in the View Source tab:

.. image:: view_source_context_menu.png
  :class: center

Go to Line
  Scrolls to the specified line. If the number is higher than the lines in a file, you receive an error message.
Wrap Long Lines (toggle)
  Wraps long lines to the width of the page.
Syntax Highlighting (toggle)
  Applies syntax highlighting to the code.When syntax highlighting is on, View Source also highlights parsing errors in red. Hovering your mouse over errors displays a tooltip explaining the error.

.. image:: view_source_error.png
  :class: border


This feature is useful when you're looking for HTML errors.

To access Go to Line from the keyboard, press :kbd:`Control` + :kbd:`Option` + :kbd:`L` on macOS, or :kbd:`Alt` + :kbd:`Shift` + :kbd:`L` on Windows or Linux.


Link to a line number
*********************

It is possible to link to a particular line, by adding the #lineNNN anchor to the url the browser will jump to the NNN line.

For example view-source:https://www.mozilla.org/#line100


View Selection Source
*********************

If you select part of a web page and context-click, you'll see a context menu item labeled "View Selection Source", that behaves just like "View Page Source", except you only see the source for the selection.


View MathML Source
******************

If you context-click while the mouse is over some `MathML <https://developer.mozilla.org/en-US/docs/Web/MathML>`_, you'll see a context menu item labeled "View MathML Source": click it to see the MathML source.


Limitations of View Source
**************************

There are limitations to what View Source does for you that you need to be aware of.

Error reporter ≠ validator
--------------------------

View Source only reports parsing errors, **not** HTML validity errors. For example, putting a `div <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div>`_ element as a child of a `ul <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul>`_ element isn't a parse error, but it **is not** valid HTML. Therefore, this error will not be flagged in View Source. If you want to check that HTML is valid, you should use an HTML validator, such as `the one offered by W3C <https://validator.w3.org/>`_.

Not all parse errors are reported
---------------------------------

Even though all the reported errors are parse errors according to the HTML specification, not all parse errors are reported by View Source. Among the errors that don't get reported:


- Bytes that are illegal according to the document's encoding aren't marked as errors.
- Forbidden characters aren't reported as errors.
- Errors related to the end-of-file aren't reported.
- Tree builder errors relating to text (as opposed to tags, comments, or doctypes) aren't reported.
- Parse errors related to ``xmlns`` attributes aren't reported.


XML syntax highlighting
***********************

View Source uses the HTML tokenizer when highlighting XML source. While the tokenizer has support for processing instructions when highlighting XML source, that's the only XML-specific capability provided. Because of this, doctypes that have an internal subset are not highlighted correctly, and entity references to custom entities are also not highlighted correctly.

This mishighlighting can be seen by viewing the source of Firefox chrome files (such as XUL documents). However, this shouldn't be a problem in practice when viewing typical XML files.


See also
********

- `HTML5 Parser-Based View Source Syntax Highlighting <https://hsivonen.iki.fi/view-source/>`_ (Blog post)

