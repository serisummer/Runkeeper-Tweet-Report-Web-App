let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.time);
	});


	let id = 0;
	tweet_array.forEach(tweet => {
		if(tweet.written) {
			id++;
			writtenTweets.push({
				id: id,
				type: tweet.activityType,
				text: tweet.text,
				link: tweet.link,
				clickable: tweet.clickableLinkText
			});
		}
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let input = document.getElementById("textFilter");
	input.oninput = () => {
		let table = document.getElementById("tweetTable");
		let matchingTweets = [];
		let searchText = input.value;
		table.innerHTML = "";

		if (searchText != "") {
			writtenTweets.forEach(tweet => {
				if (tweet['text'].includes(searchText)) {
					matchingTweets.push(tweet);
				}
			})
		}

		document.getElementById("searchCount").innerText = matchingTweets.length;
		document.getElementById("searchText").innerText = searchText;
		matchingTweets.forEach(tweet => {
			let row = table.insertRow();
			row.insertCell(0).innerText = tweet['id'];
			row.insertCell(1).innerText = tweet['type'];
			row.insertCell(2).innerHTML = tweet['text'];
		})
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});