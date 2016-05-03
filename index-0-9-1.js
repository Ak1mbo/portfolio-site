

/*
 * Author - Andrew Kim
 * v. 0.9.1
 * 
 * Description: Application of React.js to my personal website. CommentBox and
 *     related code is intellectual property of Facebook; I simply customized the code
 *     to fit with my site. 
 * Log: Added JSON data storage functionalities & AJAX server requests. CommentBox
 *     now dynamic. Menu functionality temporarily disabled.
 */

/*********************************************************/
/* Dynamic comments section - Based off Facebook's React tutorial  */
/*********************************************************/
var CommentBox = React.createClass({
	/* Retrieves comments list from server */
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {	// Replaces client data with server data
				this.setState({data: data.reverse()});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	/* Prepends comment to the list when submit is clicked */
	handleCommentSubmit: function(comment) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({data: data.reverse()});
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({data: comments});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	/* Constructor - Initializes an empty comments array */
	getInitialState: function() {
		return {data: []};
	},
	/* Refresh */
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.pollInterval);
	},
	/* Assembles the complete CommentBox */
	render: function() {
		return (
			<div className="commentBox">
				<h2>Comments</h2>
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
				<CommentList data={this.state.data} />
			</div>
		);
	}
});

var CommentForm = React.createClass({
	/* Constructor - Sets empty strings to author & text */
	getInitialState: function() {
		return {author: "", text: ""};
	},
	/* Updates text fields as user enters input */
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value});
	},
	/* Customized submit process */
	handleSubmit: function(e) {
		e.preventDefault();			// Stops submit buttons auto submit
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if(!text || !author) {		// If one of the fields is empty, do not submit
			return;
		}
		/* Calls comment list update function */
		this.props.onCommentSubmit({author: author, text: text});
		this.setState({author: "", text: ""});		// Resets author & text vars
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input
					type="text"
					placeholder="Your name"
					value={this.state.author}
					onChange={this.handleAuthorChange}
				/>
				<input
					type="text"
					placeholder="Share your opinion!"
					value={this.state.text}
					onChange={this.handleTextChange}
				/>
				<input type="submit" value="Post" />
			</form>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		/* Creates an array of formatted comments */
		var commentNodes = this.props.data.map( function(comment) {
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var Comment = React.createClass({
	/* XSS susceptible code!!! Allowing for raw HTML insertion */
	/* This is solely a test: Avoid writing code like this */
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return { __html: rawMarkup	};
	},
	/* Formats individual comments */
	render: function() {
		return (
			<div className="comment">
				<h3 className="commentAuthor">
					{this.props.author}
				</h3>
				{/* Insertion of raw HTML - BAD !!!	*/}
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});


/* Animated menu slides in from the left */
/* var main = function() {
    $('.icon-menu').click(function() {
        $('.menu').animate({
            left: '0px'
        }, 200);
        
        $('body').animate({
            left: '285px'   
        }, 200);
    });
    
    $('.icon-close').click(function() {
        $('.menu').animate({
            left: '-285px'
        }, 200);
        
        $('body').animate({
            left: '0px'
        }, 200);
    });
};

$(document).ready(main);		// Calls main when document is ready  
*/

ReactDOM.render(
	/* Creates new CommentBox with given props */
	<CommentBox url="/api/comments" pollInterval={2000} />,
	document.getElementById('commentBox')
);






































