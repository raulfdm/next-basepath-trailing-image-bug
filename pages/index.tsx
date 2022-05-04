import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";

const combinationMatrix = [
  /* basePath | trailing | img | works */
  ["✅", "✅", "✅", "🔴"],
  ["🔴", "🔴", "🔴", "✅"],
  ["✅", "✅", "🔴", "✅"],
  ["✅", "🔴", "🔴", "✅"],
  ["🔴", "✅", "✅", "✅"],
  ["🔴", "✅", "🔴", "✅"],
  ["🔴", "🔴", "✅", "✅"],
  ["✅", "🔴", "✅", "✅"],
];
const IndexPage = () => {
  const nextImgRef = useRef<HTMLImageElement>(null);
  const [imgMarkup, setImgMarkup] = useState(null);

  function onFix() {
    if (nextImgRef.current) {
      const fixedContent = nextImgRef.current.outerHTML.replaceAll(
        "/_next/",
        getPublicPath("/_next/")
      );

      setImgMarkup(fixedContent);

      nextImgRef.current.outerHTML = fixedContent;
    }
  }

  return (
    <>
      <Head>
        <title>basePath + trailingSlash + Image Component bug</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>basePath + trailingSlash + Image Component bug</h1>

      <style jsx>{`
        .imageWrapper {
          display: flex;
        }
      `}</style>

      <style jsx global>{`
        body {
          font-family: sans-serif;
        }

        table,
        th,
        td {
          border: 1px solid;
          text-align: center;
        }

        table {
          border-collapse: collapse;
        }

        thead tr td {
          max-width: 130px;
        }

        table td {
          padding: 6px 8px;
        }
      `}</style>

      <section>
        <h2>The problem</h2>
        <p>
          The combination of `basePath`, `trailingSlash` and having defined
          `images` to `next.config.js`, the image component does not resolve to
          the correct URL.
        </p>

        <h2>Matrix of combinations</h2>
        <table>
          <thead>
            <tr>
              <td>basePath</td>
              <td>trailingSlash</td>
              <td>"image" property at next.config.js</td>
              <td>Works</td>
            </tr>
          </thead>
          <tbody>
            {combinationMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr />

      <section>
        <h2>Regular {`<img>`}</h2>
        <img
          src={getPublicPath("/images/banner.jpeg")}
          width={400}
          height={200}
          alt="Banner with img tag"
        />
      </section>
      <section>
        <h2>Image Component</h2>

        <button type="button" onClick={onFix}>
          Add basePath to {`<Image>`} src and srcSet
        </button>

        <pre style={{ whiteSpace: "break-spaces" }}>
          <code>{imgMarkup}</code>
        </pre>
        <Image
          src={getPublicPath("/images/banner.jpeg")}
          width={400}
          height={200}
          alt="Banner with Image Component"
          onLoadingComplete={(a) => console.log(a)}
          onError={({ target }) => {
            nextImgRef.current = target as HTMLImageElement;
            setImgMarkup(nextImgRef.current.outerHTML);
          }}
        />
      </section>

      <section>
        <h2>Image component rendering SVG</h2>
        <Image
          src={getPublicPath("/icon.svg")}
          width={150}
          height={200}
          alt="Icon"
        />
      </section>
    </>
  );
};

function getPublicPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}${path}`;
  // return path;
}

export default IndexPage;
