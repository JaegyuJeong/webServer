class CsForm extends React.Component {
    send=()=>{
        const send_param={
            name:this.name.value,
            email:this.email.value,
            message:this.message.value
        }

        axios.post('/csForm',send_param)
        .then((response)=>{
            console.log(response);
            alert(JSON.parse(response.data).msg);
            window.location.reload(true);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    render() {
        console.log("ok");
        return(
            <form>
                <div class="row">
                    <div class="col-12 col-lg-6 wow fadeInUp" data-wow-delay="100ms">
                        <input type="text" ref={ref=> this.name=ref} name="message-name" class="form-control mb-30" placeholder="이름" />
                    </div>
                    <div class="col-12 col-lg-6 wow fadeInUp" data-wow-delay="100ms">
                        <input type="email" ref={ref=> this.email=ref}  name="message-email" class="form-control mb-30" placeholder="이메일" />
                    </div>
                    <div class="col-12 wow fadeInUp" data-wow-delay="100ms">
                        <textarea name="message" ref={ref=> this.message=ref}  class="form-control mb-30" placeholder="내용"></textarea>
                    </div>
                    <div class="col-12 text-center wow fadeInUp" data-wow-delay="100ms">
                        <button type="button" class="btn roberto-btn mt-15" onClick={this.send}>보내기</button>
                    </div>
                </div>
            </form>
        )
    }
}
ReactDOM.render(
    <CsForm />,
    document.getElementById('react-cs-form')
);