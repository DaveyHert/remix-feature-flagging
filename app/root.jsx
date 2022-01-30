import styleURL from "~/styles/global.css";
import * as configcat from "configcat-js-ssr";
import { useLoaderData } from "remix";

// Runs on the server - for api calls
export const loader = async () => {
  // Connect to your ConfigCat's dashboard
  const configCatClient = configcat.createClient(
    "fK7ZCApWbkaDu14njPKZQw/vBw-jxALN0eiWNilfwboGA"
  );

  //
  const newsFeedFlag = await configCatClient.getValueAsync(
    "newsfeedfeatureflag",
    false
  );
  console.log(newsFeedFlag);

  const news = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page"
  );
  const feed = await news.json();
  return [feed.hits, newsFeedFlag];
};

export default function App() {
  // Get state of flag and age from loader and action
  const [news, newsFeedFlag] = useLoaderData();

  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='stylesheet' href={styleURL} />
        <title>Demo Feature Flag</title>
      </head>
      <body>
        <div>
          <h1>Trending Hacker News Feed</h1>

          {newsFeedFlag ? (
            <ol>
              {news.map((n) => (
                <li key={n.id}>
                  <a href={n.url}>{n.title}</a>
                </li>
              ))}
            </ol>
          ) : (
            <h2>Ops! News Feed unavailable</h2>
          )}
        </div>
      </body>
    </html>
  );
}
