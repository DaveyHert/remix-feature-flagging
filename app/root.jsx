import styleURL from "~/styles/global.css";
import * as configCat from "configcat-js-ssr";
import { useLoaderData } from "remix";

// Runs on the server - for api calls
export const loader = async () => {
  // Connect to your ConfigCat's dashboard
  const configCatClient = configCat.createClient(
    "fK7ZCApWbkaDu14njPKZQw/vBw-jxALN0eiWNilfwboGA"
  );

  // Check status of feature flag
  const newsFeedFlag = await configCatClient.getValueAsync(
    "newsfeedfeatureflag",
    false
  );

  // Fetch stories from HN
  const stories = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page"
  );
  const newsFeed = await stories.json();

  // return stories and status of the feature flag to App component
  return [newsFeed.hits, newsFeedFlag];
};

export default function App() {
  // deconstruct the stories and state of feature flag in the loader function created above
  const [newsFeed, newsFeedFlag] = useLoaderData();

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
              {newsFeed.map((story) => (
                <li key={story.id}>
                  <a href={story.url}>{story.title}</a>
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
