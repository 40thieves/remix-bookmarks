export default function Style() {
  return (
    <main>
      <h1>Style Guide</h1>
      <article className="flow">
        <h2 id="second-level-heading">Second-level heading</h2>
        <p>
          Main page headings are <code>h1</code> elements, so further headings
          within this scope should start with <code>h2</code>, an example of
          which appears directly above. More than one may be used per page.
          Consider using an <code>h2</code> unless you need a header level of
          less importance, or as a sub-header to an existing <code>h2</code>{" "}
          element.
        </p>
        <h3 id="third-level-heading">Third-level heading</h3>
        <p>
          The header above is an <code>h3</code> element, which may be used for
          any form of page-level header which falls below the <code>h2</code>{" "}
          header in a document hierarchy.
        </p>
        <h4 id="fourth-level-heading">Fourth-level heading</h4>
        <p>
          The header above is an <code>h4</code> element, which may be used for
          any form of page-level header which falls below the <code>h3</code>{" "}
          header in a document hierarchy.
        </p>
        <h2 id="grouping-content">Grouping content</h2>
        <h3 id="paragraphs">Paragraphs</h3>
        <p>
          All paragraphs are wrapped in <code>p</code> tags.
        </p>
        <h3 id="pre-formatted-text">Pre-formatted text</h3>
        <p>
          The <code>pre</code> element represents a block of pre-formatted text,
          in which structure is represented by typographic conventions rather
          than by elements. Such examples are an e-mail (with paragraphs
          indicated by blank lines, lists indicated by lines prefixed with a
          bullet), fragments of computer code (with structure indicated
          according to the conventions of that language) or displaying{" "}
          <abbr title="American Standard Code for Information Interchange">
            ASCII
          </abbr>{" "}
          art. Here’s an example showing the printable characters of{" "}
          <abbr title="American Standard Code for Information Interchange">
            ASCII
          </abbr>
          :
        </p>
        <pre className="language-asciidoc">
          <code className="language-asciidoc">
            {"  "}! " # $ % &amp; ' ( ) * + , - . /{"\n"}0 1 2 3 4 5 6 7 8 9 : ;
            &lt; = &gt; ?{"\n"}@ A B C D E F G H I J K L M N O{"\n"}P Q R S T U
            V W X Y Z [ \ ] ^ _{"\n"}` a b c d e f g h i j k l m n o{"\n"}p q r
            s t u v w x y z {"{"} | {"}"} ~
          </code>
        </pre>
        <h3 id="blockquotes">Blockquotes</h3>
        <p>
          The <code>blockquote</code> element represents a section that is being
          quoted from another source.
        </p>
        <blockquote>
          <p>
            Big Yellow Taxi there by Joni Mitchell, a song in which she
            complains that they “paved paradise to put up a parking lot” – a
            measure which actually would have alleviated traffic congestion on
            the outskirts of paradise. Something which Joni singularly fails to
            point out, perhaps because it doesn’t quite fit in with her
            blinkered view of the world.
          </p>
          <p>Nevertheless, nice song.</p>
        </blockquote>
        <p>
          If you wish to add a citation, enclose it within a{" "}
          <code>&lt;figure&gt;</code> tag:
        </p>
        <figure>
          <blockquote cite="https://hansard.parliament.uk/Commons/1947-11-11/debates/ab1e1152-6b4a-4d04-ac38-954df6634b08/ParliamentBill#207">
            <p>
              Many forms of Government have been tried, and will be tried in
              this world of sin and woe. No one pretends that democracy is
              perfect or all-wise. Indeed, it has been said that democracy is
              the worst form of government except all those other forms that
              have been tried from time to time.
            </p>
          </blockquote>
          <figcaption>
            Winston Churchill, in{" "}
            <a href="https://hansard.parliament.uk/Commons/1947-11-11/debates/ab1e1152-6b4a-4d04-ac38-954df6634b08/ParliamentBill#207">
              a speech to the House of Commons
            </a>
            . 11th November 1947
          </figcaption>
        </figure>
        <h3 id="ordered-list">Ordered list</h3>
        <p>
          The <code>ol</code> element denotes an ordered list, and various
          numbering schemes are available through the CSS (including 1,2,3…
          a,b,c… i,ii,iii… and so on). Each item requires a surrounding{" "}
          <code>&lt;li&gt;</code> and <code>&lt;/li&gt;</code> tag, to denote
          individual items within the list (as you may have guessed,{" "}
          <code>li</code> stands for list item).
        </p>
        <ol>
          <li>This is an ordered list.</li>
          <li>
            This is the second item, which contains a sub list
            <ol>
              <li>This is the sub list, which is also ordered.</li>
              <li>It has two items.</li>
            </ol>
          </li>
          <li>This is the final item on this list.</li>
        </ol>
        <h3 id="unordered-list">Unordered list</h3>
        <p>
          The <code>ul</code> element denotes an unordered list (ie. a list of
          loose items that don’t require numbering, or a bulleted list). Again,
          each item requires a surrounding <code>&lt;li&gt;</code> and{" "}
          <code>&lt;/li&gt;</code> tag, to denote individual items. Here is an
          example list showing the constituent parts of the British Isles:
        </p>
        <ul>
          <li>
            United Kingdom of Great Britain and Northern Ireland:
            <ul>
              <li>England</li>
              <li>Scotland</li>
              <li>Wales</li>
              <li>Northern Ireland</li>
            </ul>
          </li>
          <li>Republic of Ireland</li>
          <li>Isle of Man</li>
          <li>
            Channel Islands:
            <ul>
              <li>Bailiwick of Guernsey</li>
              <li>Bailiwick of Jersey</li>
            </ul>
          </li>
        </ul>
        <p>
          Sometimes we may want each list item to contain block elements,
          typically a paragraph or two:
        </p>
        <ul>
          <li>
            <p>
              The British Isles is an archipelago consisting of the two large
              islands of Great Britain and Ireland, and many smaller surrounding
              islands.
            </p>
          </li>
          <li>
            <p>
              Great Britain is the largest island of the archipelago. Ireland is
              the second largest island of the archipelago and lies directly to
              the west of Great Britain.
            </p>
          </li>
          <li>
            <p>
              The full list of islands in the British Isles includes over 1,000
              islands, of which 51 have an area larger than 20 km².
            </p>
          </li>
        </ul>
        <h3 id="definition-list">Definition list</h3>
        <p>
          he <code>dl</code> element is for another type of list called a
          definition list. Instead of list items, the content of a{" "}
          <code>dl</code> consists of <code>dt</code> (definition term) and{" "}
          <code>dd</code> (definition description) pairs. Though it may be
          called a “definition list”, <code>dl</code> can apply to other
          scenarios where a parent/child relationship is applicable. For
          example, it may be used for marking up dialogues, with each{" "}
          <code>dt</code> naming a speaker, and each <code>dd</code> containing
          his or her words.
        </p>
        <dl>
          <dt>This is a term.</dt>
          <dd>
            This is the definition of that term, which both live in a{" "}
            <code>dl</code>.
          </dd>
          <dt>Here is another term.</dt>
          <dd>And it gets a definition too, which is this line.</dd>
        </dl>
        <h3 id="figures">Figures</h3>
        <p>
          The <code>figure</code> element is used to annotate illustrations,
          diagrams, photos, code listings or provide a citation for an excerpted
          piece of content. The following examples show a section of
          pre-formatted text, a quotation and an image:
        </p>
        <figure>
          <img
            src="/media/2017/134/a1/wild_atlantic_way.jpg"
            alt="Photo taken during my drive on the Wild Atlantic Way."
            loading="lazy"
            decoding="async"
          />
          <figcaption>Single image, with supporting caption.</figcaption>
        </figure>
        <p>
          For figures using the <code>.align-bleed</code> modifier, the content
          will stretch across the entire width of the page.
        </p>
        <figure className="align-bleed">
          <img
            src="/media/2017/134/a1/salthill_diving_tower.jpg"
            alt="Photo of Salthill Diving Tower."
            loading="lazy"
            decoding="async"
          />
          <figcaption>Single image, with supporting caption.</figcaption>
        </figure>
        <figure className="align-pull">
          <img
            src="/media/2017/134/a1/roundstone_quay.jpg"
            alt="Photo of Roundstone Quay."
            loading="lazy"
            decoding="async"
          />
          <figcaption>Single image, with supporting caption.</figcaption>
        </figure>
        <p>
          For figures using the <code>.align-pull</code> utility, the content
          will be floated to the right side of the page.
        </p>
        <h2 id="text-level-semantics">Text-level semantics</h2>
        <p>
          There are a number of inline{" "}
          <abbr title="HyperText Markup Language">HTML</abbr> elements you may
          use anywhere within other elements.
        </p>
        <h3 id="links-and-anchors">Links and anchors</h3>
        <p>
          The <code>a</code> element is used to hyperlink text, be that to
          another page, a named fragment on the current page or any other
          location on the web. Example:
        </p>
        <p>
          <a href="/">Go to the home page</a>.
        </p>
        <h3 id="stressed-emphasis">Stressed emphasis</h3>
        <p>
          The <code>em</code> element is used to denote text with stressed
          emphasis, i.e., something you’d pronounce differently. Where
          italicising is required for stylistic differentiation, the{" "}
          <code>i</code> element may be preferable. Example:
        </p>
        <p>
          You simply <em>must</em> try the negitoro maki!
        </p>
        <h3 id="strong-importance">Strong importance</h3>
        <p>
          The <code>strong</code> element is used to denote text with strong
          importance. Where bolding is used for stylistic differentiation, the{" "}
          <code>b</code> element may be preferable. Example:
        </p>
        <p>
          <strong>Don’t</strong> stick nails in the electrical outlet.
        </p>
        <h3 id="small-print">Small print</h3>
        <p>
          The <code>small</code> element is used to represent disclaimers,
          caveats, legal restrictions, or copyrights (commonly referred to as
          small print). It can also be used for attributions or satisfying
          licensing requirements. Example:
        </p>
        <p>
          <small>
            Copyright © 1922-2011 Acme Corporation. All Rights Reserved.
          </small>
        </p>
        <h3 id="citations">Citations</h3>
        <p>
          The <code>cite</code> element is used to represent the title of a work
          (e.g. a book, essay, poem, song, film, TV show, sculpture, painting,
          musical, exhibition, etc). This can be a work that is being quoted or
          referenced in detail (i.e. a citation), or it can just be a work that
          is mentioned in passing. Example:
        </p>
        <p>
          <cite>Universal Declaration of Human Rights</cite>, United Nations,
          December 1948. Adopted by General Assembly resolution 217 A (III).
        </p>
        <h3 id="inline-quotes">Inline quotes</h3>
        <p>
          The <code>q</code> element is used for quoting text inline. Example
          showing nested quotations:
        </p>
        <p>
          John said,{" "}
          <q>
            I saw Lucy at lunch, she told me{" "}
            <q>Mary wants you to get some ice cream on your way home</q>. I
            think I will get some at Ben and Jerry’s, on Gloucester Road.
          </q>
        </p>
        <h3 id="abbreviation">Abbreviation</h3>
        <p>
          The <code>abbr</code> element is used for any abbreviated text,
          whether it be acronym, initialism, or otherwise. Any text in the{" "}
          <code>title</code> attribute will appear when the user’s mouse hovers
          the abbreviation. Example abbreviations:
        </p>
        <p>
          <abbr title="British Broadcasting Corporation">BBC</abbr>,{" "}
          <abbr title="HyperText Markup Language">HTML</abbr>, and{" "}
          <abbr title="Staffordshire">Staffs.</abbr>
        </p>
        <h3 id="time">Time</h3>
        <p>
          The <code>time</code> element is used to represent either a time on a
          24 hour clock, or a precise date in the proleptic Gregorian calendar,
          optionally with a time and a time-zone offset. Example:
        </p>
        <p>
          Queen Elizabeth II was proclaimed sovereign of each of the
          Commonwealth realms on <time dateTime="1952-02-6">6</time> and{" "}
          <time dateTime="1952-02-7">7 February 1952</time>, after the death of
          her father, King George VI.
        </p>
        <h3 id="code">Code</h3>
        <p>
          The <code>code</code> element is used to represent fragments of
          computer code. Useful for technology-oriented sites, not so useful
          otherwise. Example:
        </p>
        <p>
          When you call the <code>activate()</code> method on the{" "}
          <code>robotSnowman</code> object, the eyes glow.
        </p>
        <p>
          The following examples shows the <code>code</code> element used in
          conjunction with the <code>pre</code> element (with the applicable
          syntax highlighting applied automatically):
        </p>
        <pre className="language-js">
          <code className="language-js">
            console<span className="token punctuation">.</span>
            <span className="token function">log</span>
            <span className="token punctuation">(</span>
            <span className="token string">"Hello World!"</span>
            <span className="token punctuation">)</span>
            <span className="token punctuation">;</span>
          </code>
        </pre>
        <h3 id="sample-output">Sample output</h3>
        <p>
          The <code>samp</code> element is used to represent (sample) output
          from a program or computing system. Useful for technology-oriented
          sites, not so useful otherwise. Example:
        </p>
        <p>
          The computer said <samp>Too much cheese in tray two</samp> but I
          didn’t know what that meant.
        </p>
        <h3 id="keyboard-entry">Keyboard entry</h3>
        <p>
          The <code>kbd</code> element is used to denote user input (typically
          via a keyboard, although it may also be used to represent other input
          methods, such as voice commands). Example:
        </p>
        <p>
          To take a screenshot on your Mac, press <kbd>⌘ Cmd</kbd> +{" "}
          <kbd>⌘ Shift</kbd> + <kbd>3</kbd>.
        </p>
        <h3 id="marked-or-highlighted-text">Marked or highlighted text</h3>
        <p>
          The <code>mark</code> element is used to represent a run of text
          marked or highlighted for reference purposes. When used in a quotation
          it indicates a highlight not originally present but added to bring the
          reader’s attention to that part of the text. When used in the main
          prose of a document, it indicates a part of the document that has been
          highlighted due to its relevance to the user’s current activity.
          Example:
        </p>
        <p>
          I also have some <mark>kitten</mark>s who are visiting me these days.
          They’re really cute. I think they like my garden! Maybe I should adopt
          a <mark>kitten</mark>.
        </p>
        <h2 id="edits">Edits</h2>
        <p>
          The <code>del</code> element is used to represent deleted or retracted
          text which still must remain on the page for some reason. Meanwhile
          its counterpart, the <code>ins</code> element, is used to represent
          inserted text. Both <code>del</code> and <code>ins</code> have a{" "}
          <code>datetime</code> attribute which allows you to include a
          timestamp directly in the element. Example inserted text and usage:
        </p>
        <p>
          She bought <del dateTime="2005-05-30T13:00:00">two</del>{" "}
          <ins dateTime="2005-05-30T13:00:00">five</ins> pairs of shoes.
        </p>
        <h2 id="tabular-data">Tabular data</h2>
        <p>
          Tables should be used when displaying tabular data. The{" "}
          <code>thead</code>, <code>tfoot</code> and <code>tbody</code> elements
          enable you to group rows within each a table.
        </p>
        <p>
          If you use these elements, you must use every element. They should
          appear in this order: <code>thead</code>, <code>tfoot</code> and{" "}
          <code>tbody</code>, so that browsers can render the foot before
          receiving all the data. You must use these tags within the table
          element.
        </p>
        <table>
          <thead>
            <tr>
              <th>The Very Best Eggnog</th>
              <th>Serves 12</th>
              <th>Serves 24</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Milk</td>
              <td>1 quart</td>
              <td>2 quart</td>
            </tr>
            <tr>
              <td>Cinnamon Sticks</td>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Vanilla Bean, Split</td>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Cloves</td>
              <td>5</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Mace</td>
              <td>10</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Egg Yolks</td>
              <td>12</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Cups Sugar</td>
              <td>1 1/2 cups</td>
              <td>3 cups</td>
            </tr>
            <tr>
              <td>Dark Rum</td>
              <td>1 1/2 cups</td>
              <td>3 cups</td>
            </tr>
            <tr>
              <td>Brandy</td>
              <td>1 1/2 cups</td>
              <td>3 cups</td>
            </tr>
            <tr>
              <td>Vanilla</td>
              <td>1 tbsp</td>
              <td>2 tbsp</td>
            </tr>
            <tr>
              <td>Light Cream</td>
              <td>1 quart</td>
              <td>2 quart</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h2 className="visually-hidden" id="footnotes">
          Footnotes
        </h2>
        <ol className="footnotes">
          <li id="fn1" className="footnote-item">
            <p>
              This scope may also include footnotes.{" "}
              <a href="#fnref1" className="footnote-backref">
                ↩︎
              </a>
            </p>
          </li>
        </ol>
      </article>
    </main>
  )
}
