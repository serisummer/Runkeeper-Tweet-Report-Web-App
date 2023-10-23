function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	const firstDate = tweet_array[tweet_array.length-1].time.toLocaleDateString(undefined, options);
	const lastDate = tweet_array[0].time.toLocaleDateString(undefined, options);
	document.getElementById('firstDate').innerText = firstDate;
	document.getElementById('lastDate').innerText = lastDate;

	let completed = 0, live = 0, achieve = 0, mis = 0;
	tweet_array.forEach(element => {
		let tweet = new Tweet(element.text, element.time);
		if (tweet.source == 'completed_event') {
			completed += 1;
		}
		else if (tweet.source == 'live_event') {
			live += 1;
		}
		else if (tweet.source == 'achievement') {
			achieve += 1;
		}
		else {
			mis += 1;
		}
	});
	
	let completedPct = math.format(completed / tweet_array.length * 100, 3),
		livePct = math.format(live / tweet_array.length * 100, 3),
		achievePct = math.format(achieve / tweet_array.length * 100, 3),
		misPct = math.format(mis / tweet_array.length * 100, 3);

	Array.from(document.getElementsByClassName('completedEvents')).forEach(element => {
		element.innerText = completed;
	});
	Array.from(document.getElementsByClassName('liveEvents')).forEach(element => {
		element.innerText = live;
	});
	Array.from(document.getElementsByClassName('achievements')).forEach(element => {
		element.innerText = achieve;
	});
	Array.from(document.getElementsByClassName('miscellaneous')).forEach(element => {
		element.innerText = mis;
	});


	Array.from(document.getElementsByClassName('completedEventsPct')).forEach(element => {
		element.innerText = completedPct + '%';
	});
	Array.from(document.getElementsByClassName('liveEventsPct')).forEach(element => {
		element.innerText = livePct + '%';
	});
	Array.from(document.getElementsByClassName('achievementsPct')).forEach(element => {
		element.innerText = achievePct + '%';
	});
	Array.from(document.getElementsByClassName('miscellaneousPct')).forEach(element => {
		element.innerText = misPct + '%';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});