import styleURL from "~/styles/global.css";
import { Form } from "remix";
import { useLoaderData } from "remix";
import { useActionData } from "remix";
import * as configcat from "configcat-js-ssr";

// Runs on the server - for api calls
export const loader = async () => {
  // Connect to dashboard through SDK
  let configCatClient = configcat.createClient(
    "fK7ZCApWbkaDu14njPKZQw/vBw-jxALN0eiWNilfwboGA"
  );

  // Check if feature is on/off
  const isFeatureFlagEnabled = await configCatClient.getValueAsync(
    "calculateuseragefeature",
    false
  );

  return isFeatureFlagEnabled;
};

// Access form data on server, return age calculated
export const action = async ({ request }) => {
  const form = await request.formData();
  const birthYear = form.get("birthyear");
  const age = 2021 - birthYear;

  if (!birthYear) return "error";

  return age;
};

export default function App() {
  // Get state of flag and age from loader and action
  const isFeatureFlagEnabled = useLoaderData();
  const age = useActionData();

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
        {/* Check if feature is on/off */}
        {isFeatureFlagEnabled ? (
          <h3>Feature is available</h3>
        ) : (
          <h3>Feature is turned off</h3>
        )}

        {/* Disabe or enable feature based on flag */}
        {isFeatureFlagEnabled && (
          <Form method='post'>
            <label>
              <span>What is your birthYear?</span>
              <input type='text' name='birthyear' />
            </label>
            <button className='btn'>Submit</button>
          </Form>
        )}

        {age != "error" && isFeatureFlagEnabled && (
          <p>You are {age} years old</p>
        )}
      </body>
    </html>
  );
}
