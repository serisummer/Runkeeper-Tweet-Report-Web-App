function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let stats = displayStats(tweet_array);

	let keyValues = [];
	for (let key in stats) {
		keyValues.push([key, stats[key]]);
	}
	keyValues.sort(function compare(kv1, kv2) {
		return kv2[1].totalFrequency - kv1[1].totalFrequency;
		})
	let firstMost = keyValues[0];
	let secondMost = keyValues[1];
	let thirdMost = keyValues[2];

	let topThree = [firstMost, secondMost, thirdMost];
	topThree.sort(function compare(kv1, kv2) {
		return kv2[1].totalDistance - kv1[1].totalDistance;
		})

	let frequencyByDayFirstMost = topThree[0][1]['distanceByDay'];
	let weekdaysDistance = frequencyByDayFirstMost['Mon'] + 
							frequencyByDayFirstMost['Tue'] + 
							frequencyByDayFirstMost['Wed'] + 
							frequencyByDayFirstMost['Thu'] + 
							frequencyByDayFirstMost['Fri'];
	let weekendsDistance = frequencyByDayFirstMost['Sat'] + 
							frequencyByDayFirstMost['Sun'];
	let weekdayOrWeekendLonger;
	if (weekdaysDistance > weekendsDistance) {
		weekdayOrWeekendLonger = 'weekdays';
	}
	else {
		weekdayOrWeekendLonger = 'weekends';
	}

	document.getElementById('numberActivities').innerText = Object.keys(stats).length;
	document.getElementById('firstMost').innerText = firstMost[0];
	document.getElementById('secondMost').innerText = secondMost[0];
	document.getElementById('thirdMost').innerText = thirdMost[0];
	document.getElementById('longestActivityType').innerText = topThree[0][0];
	document.getElementById('shortestActivityType').innerText = topThree[2][0];
	document.getElementById('weekdayOrWeekendLonger').innerText = weekdayOrWeekendLonger;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let valueArray1 = []
	let keys = Object.keys(stats);
	for (let i = 0; i < keys.length; i++) {
		let temp = {};
		temp['activity'] = keys[i];
		temp['count'] = stats[keys[i]]['totalFrequency'];
		valueArray1.push(temp);
	}
	
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A simple bar chart with embedded data.",
		"width": 1200,
		"data": {
		  "values": valueArray1
		},
		"mark": "bar",
		"encoding": {
		  "x": {"field": "activity", "type": "nominal", "axis": {"labelAngle": 0}},
		  "y": {"field": "count", "type": "quantitative"}
		}
	  };
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	let valueArray2 = [];
	tweet_array.forEach(tweet => {
		if((tweet.activityType===firstMost[0]) || 
		(tweet.activityType===secondMost[0]) ||
		(tweet.activityType===thirdMost[0]) ){
			valueArray2.push({
				activity: tweet.activityType,
				day: tweet.day,
				distance: tweet.distance
			});
		}
	});

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 500,
		"height": 300, 
	  	"data": {
			"values": valueArray2
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				"axis": {"title": "day of the week"}
			},
			"y": {
				"field": "distance",
				"type": "quantitative"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"scale": {
					"domain": [firstMost[0],secondMost[0],thirdMost[0]],
					"range": ["#500ffc", "#4adb10", "#940b4a"]
				},
				"legend": {"title": "Activity Type"}
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});


	distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 500,
		"height": 300, 
	  "data": {
			"values": valueArray2
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				"axis": {"title": "day of the week"}
			},
			"y": {
				"field": "distance",
				"aggregate": "average",
				"type": "quantitative"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"scale": {
					"domain": [firstMost[0],secondMost[0],thirdMost[0]],
					"range": ["#500ffc", "#4adb10", "#940b4a"]
				},
				"legend": {"title": "Activity Type"}
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});
}

function displayStats(tweets) {
	let dict = {};
	for (let i = 0; i < tweets.length; i++) {
		if (dict[tweets[i].activityType] === undefined) {
			dict[tweets[i].activityType] = {distanceByDay: {'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0}, totalDistance: 0, 
										   frequencyByDay: {'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0}, totalFrequency: 0};
		}
		dict[tweets[i].activityType].distanceByDay[tweets[i].day] += tweets[i].distance;
		dict[tweets[i].activityType].frequencyByDay[tweets[i].day] += 1;
		dict[tweets[i].activityType].totalDistance += tweets[i].distance;
		dict[tweets[i].activityType].totalFrequency += 1;
	}
	return dict;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);

	let button = document.getElementById("aggregate");
	let dvAg = document.getElementById("distanceVisAggregated");
	let dv = document.getElementById("distanceVis");
	dvAg.style.display = "none";
	button.onclick = (() => {
		if (dvAg.style.display === "none") {
			button.innerText = "Show all activities";
			dvAg.style.display = "block";
			dv.style.display = "none";
		} else {
			button.innerText = "Show means";
			dvAg.style.display = "none";
			dv.style.display = "block";
		}
	});
});