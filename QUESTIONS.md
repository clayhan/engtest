## 1. What would you add to your solution if you had more time?

The biggest improvements that I would have liked to have made outside of general styling was that I did not get around to was using react-virtualized to make the application more performant. This would allow users to be able to render rows of my orderbook table as they scroll to it, as opposed to having to do the serious rendering upfront.

The feature I most wanted to add was Price Level Grouping so I would be able to allow the user to select a range in which the prices could be lumped together, as opposed to a large page of prices.

Code wise, I wish I was able to get around to unit tests to ensure my code is sound and I wish I was able to get around to error handling/error states so the app could fail gracefully.

## 2. What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

I would absolutely want to leverage react-virtualized so that the end user would receive the most performant experience. I would also want to ensure that I would come up with an even more elegant throttle solution so that the user would perceive quick updates to the order book.

## 3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

Optional chaining has been the most useful feature for me since now I can avoid having to write really verbose code to check for if an object property is undefined or not. In the past I would spend a lot more time needing to spot for edge cases that would arise by trying to access a property on an object that may or may not exist yet.

In this app, I specifically use:

```
if (newBids?.length > 0) {
  bids.current = handleOrdersUpdate([...bids.current], newBids);
}
if (newAsks?.length > 0) {
  asks.current = handleOrdersUpdate([...asks.current], newAsks);
}
```

In the past I may have needed to leverage .hasOwnProperty().

## 4. How would you track down a performance issue in production? Have you ever had to do this?

I leverage Sentry.io heavily in my job so that I can be alerted of potential issues and be able to stack trade any problems. This software also provides performance monitoring so that I may be able to see which pages lag the most for a user and would require more attention.

## 5. Can you describe common security concerns to consider for a frontend developer?

## 6. How would you improve the Kraken API that you just used?

I would have loved the ability to provide a custom delay to the API so that messages came in at a more manageable pace. While I actually enjoyed the format in which the data came in for the purposes of quickly working on the application, I felt it perhaps could have been presented to the frontend in a more efficient manner to prevent the frontend from needing to perform as many calculations.
