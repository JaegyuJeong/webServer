class ContactForm extends React.Component {
    send=()=>{
        const send_param={
            name:this.name.value,
            email:this.email.value,
            phone:this.phone.value,
            message:this.message.value
        }
        
        axios.post('/contactForm',send_param)
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
        });
    }

    render() {
        console.log("ok");
        return (
            <form id="contact-form" method="post" enctype="multipart/form-data">
                <fieldset>
                    <label><span class="text-form">Name:</span><input ref={ref=>this.name=ref} name="p1" type="text" /></label>
                    <label><span class="text-form">Email:</span><input ref={ref=>this.email=ref} name="p2" type="text" /></label>
                    <label><span class="text-form">Phone:</span><input ref={ref=>this.phone=ref} name="p3" type="text" /></label>
                    <div class="wrapper"><div class="text-form">Message:</div><textarea ref={ref=>this.message=ref}></textarea></div>
                    <div class="buttons">
                        <a class="button" href="#" onClick="document.getElementById('contact-form').reset()">Clear</a>
                        <a class="button" href="#" onClick={this.send} >Send</a>
                    </div>
                </fieldset>
            </form>
        )
    }
}

ReactDOM.render(
    <ContactForm />,
    document.getElementById('react-contact-form')
);