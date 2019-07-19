class MedicalReportForm extends React.Component{
    send=()=>{
        const send_param={
                        name: this.name.value,
                        rnum: this.rnum.value,
                        address: this.address.value,
                        email: this.email.value,
                        date: this.date.value,
                        iarea: this.iarea.value,
                        iname: this.iname.value,
                        comments: this.comments.value
                    }
                    
                    axios.post('/MedicalReportForm',send_param)
                        .then((response)=>{
                            console.log(response);
                        })
                        .catch((error)=>{
                            console.log(error);
                    });
    }
    
    render(){     
        const main={
            width:'900px',
            height:'800px',
            margin:'30px auto'
            }
        const first={
            width:'400px',
            height:'740px',
            boxShadow:'0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15)',
            float:'left',
            padding:'10px 50px 0',
            background:'linear-gradient(#fff,#f2f6f9)'
            }
       
            const label={
            fontSize:'17px'            
            }
            const     input={
            width:'400px',
            padding:'5px',
            marginTop:'10px',
            marginBottom:'10px',
            borderRadius:'5px',
            border:'1px solid #cbcbcb',
            boxShadow:'inset 0 1px 2px rgba(0,0,0,0.18)',
            fontSize:'16px'
            }
            const select={
                padding:'13px'
            }
            const     textarea={
            width:'400px',
            height:'100px',
            padding:'10px',
            marginTop:'10px',
            marginBottom:'10px',
            borderRadius:'5px',
            border:'1px solid #cbcbcb',
            boxShadow:'inset 0 1px 2px rgba(0,0,0,0.18)',
            fontSize:'16px'
            }
            const input_type_submit={
            background:'linear-gradient(to bottom,#22abe9 5%,#36caf0 100%)',
            boxShadow:'inset 0 1px 0 0 #7bdcf4',
            border:'1px solid #0F799E',
            color:'#fff',
            fontSize:'19px',
            fontWeight:'700',
            cursor:'pointer',
            textShadow:'0 1px 0 #13506D'            
            }
            const center={
                align:'center'
            }
            
        return (
          
            <div style={main}>
                <div style={first}>
                <form action="" method="post">
                <h1>Medical Report Form</h1>
                <h4>Please fill all entries.</h4><hr/>
                <label style={label}>Name :</label>
                <input style={input} ref={ref=>this.name=ref} placeholder="환자명" />
                <label style={label}>주민등록번호 :</label>
                <input style={input} ref={ref=>this.rnum=ref} placeholder="환자 주민등록번호" />
                <label style={label}>주소 :</label>
                <input style={input} ref={ref=>this.address=ref} placeholder="환자 주소" />
                <label style={label}>Email :</label>
                <input style={input} ref={ref=>this.email=ref} placeholder="환자 Email" type="email"/>
                <label style={label}>진료일 :</label>
                <input style={input} ref={ref=>this.date=ref} type="date"/>
                <label style={label}>상병부위 :</label>
                <input style={input} ref={ref=>this.iarea=ref} placeholder="상병부위" />
                <label style={label}>상병명 :</label>
                <select name="select" style={select} ref={ref=>this.iname=ref}>
                <option value="value1">한국질병분류코드로 선택하세요</option> 
                <option value="value2" >Value 2</option>
                <option value="value3">Value 3</option>
                </select><br/><br/>
                <label style={label}>진료내용 :</label>
                <textarea style={textarea} ref={ref=>this.comments=ref} placeholder="가능한 자세히 입력하세요">
                </textarea>
               
                <input style={input_type_submit} onClick={this.send} name="dsubmit" type="submit" value="Send"/>
               
                </form>
                </div>
            </div>
           
        )
    }
}

ReactDOM.render( 
    <MedicalReportForm / > ,
    document.getElementById('react-medical-report-form')
);
