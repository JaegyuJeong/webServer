class Circle extends React.Component {
    render() {
        var circleStyle = {
            padding: 10,
            margin: 20,
            display: "inline-block",
            backgroundColor: this.props.bgColor,
            borderRadius: "50%",
            width: 100,
            height: 100,
        };

        return(
            <div style={circleStyle}></div>
        );
    }
}

const renderData = [];

function showCircle() {
    const colors =["#393E41", "#E94F37", "#1C89BF", "#A1D363",
                    "#85FFC7", "#297373", "#FF8552", "#A40E4C"];
    
    for (let i =0; i < colors.length; i++) {
        renderData.push(<Circle  bgColor={colors[i]} />);
    }
    
}

showCircle();

ReactDOM.render(
    <div>
        {renderData}
    </div>,
    document.querySelector("#container")
)