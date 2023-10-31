class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return 'completed_event';
        }
        if (this.text.startsWith("Watch")) {
            return 'live_event';
        }
        if (this.text.startsWith("Achieved")) {
            return 'achievement';
        }
        return 'miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes('-')){
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text.substring(this.text.indexOf('-') + 2, this.text.indexOf('http') - 1);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let textLower = this.text.toLowerCase();
        if (textLower.includes(' ski ')) {
            return "skiing";
        }
        if(textLower.includes(' run ') ) {  
            return 'running';
        }
        if(textLower.includes(' walk ')) {
            return "walking"; 
        }
        if(textLower.includes(' mtn ')) {
            return "mountain biking";
        }
        if(textLower.includes(' bike ')) {
            return "biking";
        }
        if(textLower.includes(' hike ')) {
            return "hiking";
        }
        if(textLower.includes(' activity ')) {
            return "activity"; 
        }
        if(textLower.includes(' swim ')) {
            return "swimming"; 
        }
        if(textLower.includes(' chair ride ')) {
            return "chair riding"; 
        }
        if(textLower.includes(' yoga ')){
            return "yoga";
        }
        if(textLower.includes(' workout ')){
            return "workout";
        }
        if(textLower.includes(' freestyle ')){
            return "freestyle"; 
        }
        if(textLower.includes(' row ')){
            return "rowing";
        }
        if(textLower.includes(' snowboard ')){
            return "snowboard";
        }
        if(textLower.includes(' meditation ')){
            return "meditating";
        }
        if(textLower.includes(' pilates ')){
            return "pilates";
        }
        if(textLower.includes(' skate ')){
            return "skating";
        }
        if(textLower.includes(' boxing ')){
            return "boxing";
        }
        if(textLower.includes(' dance')){
            return "dance";
        }
        if(textLower.includes(' football')){
            return "football";
        }
        if(textLower.includes(' gym')){
            return "gym";
        }
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        if (this.text.includes(' mi '))
            return parseFloat(this.text.substring(this.text.indexOf(' a ') + 3, this.text.indexOf(' mi ') + 3));
        if (this.text.includes(' km ')) {
            return parseFloat(this.text.substring(this.text.indexOf(' a ') + 3, this.text.indexOf(' km ') + 3)) * 0.621371;
        }
        return 0;
    }


    get day():string {
        if(this.time.toString().includes('Mon')) {
            return "Mon";
        }
        if(this.time.toString().includes('Tue')) {
            return "Tue";
        }
        if(this.time.toString().includes('Wed')) {
            return "Wed";
        }
        if(this.time.toString().includes('Thu')) {
            return "Thu";
        }
        if(this.time.toString().includes('Fri')) {
            return "Fri";
        }
        if(this.time.toString().includes('Sat')) {
            return "Sat";
        }
        if(this.time.toString().includes('Sun')) {
            return "Sun";
        }
        return "";
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}