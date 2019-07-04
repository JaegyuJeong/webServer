class Colorizer extends React.Component {
    state={
        color: "",
        bgColor: "yellow",
        positionX:0,
        positionY:0
    }

    componentDidMount(){
        setInterval(()=>{
            this.setState({
                positionX: Math.random()*100,
                positionY: Math.random()*70,
            });
            
        },1000);
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
        e.preventDefault();
    }

    game=(e)=> {
        this.setState({
            bgColor:"#"+Math.floor(Math.random()*500000)
        });
    }

    render() {
        const circleStyle = {
            width: 100,
            height: 100,
            borderRadius:"50%",
            backgroundColor: this.state.bgColor
        }
        const divStyle ={
            marginLeft: this.state.positionX,
            marginTop: this.state.positionY
        }
        return (
            <div style={divStyle}>
                <div onClick={this.game} style={circleStyle}></div>
                
                <form onSubmit={this.setNewColor}>
                    <input onChange={this.colorValue}></input>
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