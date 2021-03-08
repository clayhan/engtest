## 1. What would you add to your solution if you had more time?

The biggest improvements that I would like to have made (outside of general styling) was implementing react-virtualized to make the application more performant. This would allow users to render rows of my orderbook table as they scroll through it, as opposed to having to do the serious rendering up front.

Code wise, I wish I was able to get around to more thoughtful unit tests to ensure my code is sound, more strict TypeScript typing, and I would have liked to try breaking the app even more and developing error handling/error states so that the app could fail gracefully. I also would have liked to have abstracted my component code to be even more clean/modular.

## 2. What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

I would want to implement a variety of tools to capture user experiences while they are on the application. This may include using Sentry.io/Datadog for performance/error monitoring, as I would want to know if any exceptions were thrown on users. I would also want to ensure that I placed more thought on navigating edge cases, as I would want the app to fail gracefully in the event an exception was thrown or an API call failed. I would also want unit tests for the most important components.

For UX, I would want to create more error states, as well to qualm users. I would also want to try to take advantage of a CDN for assets and explore other caching strategies.

## 3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

Optional chaining has been the most useful feature for me, since I can now avoid having to write really verbose code to check for whether an object property is undefined. In the past, I would spend a lot more time looking for edge cases that would arise from trying to access a property on an object that may or may not exist yet. In the past, I may have needed to leverage .hasOwnProperty().

In this app, I specifically use:

```
if (newBids?.length > 0) {
 bids.current = handleOrdersUpdate([...bids.current], newBids);
}
if (newAsks?.length > 0) {
 asks.current = handleOrdersUpdate([...asks.current], newAsks);
}
```

For my current role, the applications I work on often need to perform several API calls in succession, since we integrate several applications. I really like `Promise.allSettled`. An example snippet might look like:

```
const arrOfApiCalls = [someCallToApp1, someCallToApp2, anotherCallToApp1, someCallToApp3];
Promise.allSettled(arrOfApiCalls).
 then(res =>
   // update the state of my react app accordingly
 );
```

## 4. How would you track down a performance issue in production? Have you ever had to do this?

I leverage Sentry.io heavily in my job so that I can be alerted of potential issues and be able to stack trade any problems. This software also provides performance monitoring so that I can see which pages lag the most for a user and would require more attention.

I was most concerned with performance when I worked at CBS Sports, since that had a more public audience and a lot of traffic. A lot of what I had to do to increase application performance involved caching, compressing assets, and preventing unnecessary renders of the application. Sentry.io + Google PageSpeed helped a lot for application performance and finding the trouble spots.

## 5. Can you describe common security concerns to consider for a frontend developer?

The security concern I try to address first is usually XSS. I try to be thoughtful about any work I do, such as inputs, where a user is inputting data. I try to ensure that a user cannot place malicious code into the inputs by trying to validate all the inputs I write.

In my current role, authentication is a big security concern, especially since tokens are used to identify private information. We leverage Okta and try to ensure we never expose a user's token, make sure that tokens expire within a safe time frame, and whitelist domains accordingly.

## 6. How would you improve the Kraken API that you just used?

I would have loved the ability to provide a custom delay to the API so that messages came in at a more manageable pace. While I actually enjoyed the format in which the data came in for the purposes of quickly working on the application, I felt it perhaps could have been presented to the frontend in a more efficient manner to prevent the frontend from needing to perform as many calculations.
