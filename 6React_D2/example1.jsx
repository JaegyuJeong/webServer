class PlusButton extends React.Component{
    render() {
        return(
            <div>
                <button onClick={this.props.clickHandler}>+</button>
            </div>
        );
    }
}




class Counter extends React.Component{
    
    render() {
        return(
            <div>
                {this.props.display}
            </div>
        );
    }
}

class CounterParent extends React.Component {
    state ={
        count:0
    }

    increase= () => {
        this.setState({
            count: this.state.count + 1
        });
    }

    componentWillUpdate(newProps, newState) {
        console.log("componentWillUpdate: Component is about to update!");
    }
    componentDidUpdate(currentProps, currentState) {
        console.log("componentDidUpdate: Component just updated!");
    }
    componentWillMount() {
        console.log("componentWillMount: Component is about to mount!");
    }
    componentDidMount() {
        console.log("componentDidMount: Component just mounted!");
    }
    componentWillUnmount() {
        console.log("componentWillUnmount: Component is about to br removed from the DOM!");
    }

    shouldComponentUpdate(newProps,newState) {
        console.log("shouldComponentUpdate: Should component update?");
        if(newState.count <5) {
            console.log("shouldComponentUpdate: Component should update!");
            return true;
        } else {
            ReactDOM.unmountComponentAtNode(document.querySelector("#container"));
            console.log("shouldComponentUpdate: Component should not update!");
            return false;
        }
    }

    componentWillReceiveProps(newProps) {
        console.log("componentWillReceiveProps: Component will get new props!");
    }
    render(){
        console.log("render");
        return (
            <div>
                <Counter display={this.state.count}/>
                <PlusButton clickHandler={this.increase}/>
            </div>
        );
    }   
}
console.log("defaultProps: Default prop time!");
CounterParent.defaultProps = {

};



ReactDOM.render(
    <CounterParent/>,
    document.querySelector("#container")
);