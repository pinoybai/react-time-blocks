export const msToTime = (duration) => {
    //let milliseconds = Math.floor((duration % 1000) / 100),
         let seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return hours + ":" + minutes + ":" + seconds;// + "." + milliseconds;
}

export function millisecondsToStr(milliseconds) {
    let returnString = '';

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var hours = Math.floor((temp %= 86400) / 3600);

    if (hours) {
        returnString = hours + ' hr' + numberEnding(hours)+' ';
    }

    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        returnString += minutes + 'm ';
    }

    var seconds = temp % 60;
    if (seconds) {
        returnString += seconds + 's';
    }

    return returnString;
}

export const msToPx = (ms, zoom) => {
    //every 10 pixels is 1 minute
    return parseFloat(ms/zoom);
    //return (ms/1000) / 10;
}

export const pxToMs = (px, zoom) => {
    //every 10 pixels is 1000 ms/1 minute

    return (px*zoom);
    //return (px * 1000) * 10;
}

export const getZoomValue = (currentZoom, zoomType) => {
    if(zoomType === "IN"){
        if(currentZoom == 12000){
            return 30000;
        }
        return currentZoom / 2;
    }

    if(zoomType == "OUT"){
        if(currentZoom == 12000){
            return 12000;
        }

        return currentZoom * 2;
    }
}

export const roundNearestTen = (num) => {
    return Math.ceil(num / 10) * 10;
}

export const genRandTaskId = () => {
    let len = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for ( let i = 0; i < len; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }

	   return result;
}

export const getRandColor = () => {
    var color = ["#a29bfe", "#6c5ce7", "#ffeaa7", "#fab1a0", "#00cec9", "#55efc4", "#e84393", "#e1b12c" ,"#273c75"];
		
	return color[Math.floor(Math.random() * color.length)];
}

export const getRandTaskName = () => {
    let tasks = ["Organize your closet", 
                "Watch a movie", 
                "Clean up photo library", 
                "Clean your room", 
                "Meditation", 
                "Learn Something new",
                "Remove bad habits",
                "Improve Communication skills",
                "Watch something I liked in my childhood"]
    return tasks[Math.floor(Math.random() * tasks.length)]
}
