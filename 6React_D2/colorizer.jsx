class Colorizer extends React.Component {
    state={
        color: "",
        bgColor: "yellow",
    }

    colorValue=(e)=>{
        this.setState({
            color: e.target.value
        });
    }
    setNewColor=(e) => {
        console.log("setNewColor");
        this.setState({
            bgColor:this.state.color
        });
        this._input.focus();
        this._input.value="";
        e.preventDefault();
    }

    render() {
        // const self=this;
        const squareStyle = {
            width: 100,
            height: 100,
            backgroundColor: this.state.bgColor
        }
        
        return (
            <div>
                <div style={squareStyle}></div>
                <form onSubmit={this.setNewColor}>
                    <input ref={(ref)=>{this._input =ref;}} onChange={this.colorValue}></input>
                    <button>go</button>
                </form>
            </div>
        );
    }

}
ReactDOM.render(
    <Colorizer/>,
    document.querySelector("#container")
);