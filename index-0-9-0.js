

/*
 * Author - Andrew Kim
 * v. 0.9.0
 * 
 * Description: Application of React.js to my personal website. CommentBox and
 *     related code is intellectual property of Facebook; I simply customized the code
 *     to fit with my site. 
 * Log: Framework for a comments section using React.js practices. No current
 *     functionalities - only displays static data. Includes menu functionality.
 */

/*******************************************************/
/* Static comments section - Based off Facebook's React tutorial  */
/*******************************************************/
var CommentBox = React.createClass({
	/* Assembles the complete CommentBox */
	render: function() {
		return (
			<div className="commentBox">
				<h2>Comments</h2>
				<CommentForm />
				<CommentList data={this.props.data} />
			</div>
		);
	}
});

var CommentForm = React.createClass({
	/* Non-functional comment submit field */
	render: function() {
		return (
			<form className="commentForm">
				<input
					type="text"
					placeholder="Your name"
				/>
				<input
					type="text"
					placeholder="Share your opinion!"
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
	/* This is solely a test: Avoid write code like this */
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return { __html: rawMarkup	};
	},
	/* Formats individual comments */
	render: function() {
		return (
			<div className="comment">
				<h3 className="commentAuthor">
					{this.props.author}:
				</h3>
				{/* Insertion of raw HTML - BAD !!!	*/}
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});

/* Static data array for testing purposes */
var data = [
	{
        id: 1388534400000,
        author: "Bill Gates",
        text: "Andrew's work is a window to a new field of computer science!"
    },
    {
        id: 1420070400000,
        author: "Larry Page",
        text: "Why haven't I hired this guy yet? Search me!"
    },
    {
        id: 1461977516256,
        author: "Alan Turing",
        text: "An enigma I have yet to crack!"
    },
    {
        id: 1462004705744,
        author: "George Boole",
        text: "Truly an essential member of any programming team!"
    }
];

/* Animated menu slides in from the left */
var main = function() {
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

ReactDOM.render(
	<CommentBox data={data} />,	// Creates a new CommentBox with given data
	document.getElementById('comments')
);