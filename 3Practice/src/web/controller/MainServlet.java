package web.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import web.model.MemberDAO;


public class MainServlet extends HttpServlet {

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
		System.out.println("get요청 처리...");
		process(request,response);
		
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		System.out.println("post요청 처리...");
		process(request,response);
	
	}
	
	protected void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("process요청 처리중...");
		String sign=request.getParameter("sign");
		if(sign!=null) {
			if(sign.equals("login")) {
				String id=request.getParameter("id");
				String pw=request.getParameter("pw");
				
				//db... MemberDAO
				MemberDAO dao=new MemberDAO();
				try {						
					String username=dao.login(id,pw);
					if(username!=null) {	//login ok
						HttpSession session=request.getSession();
						System.out.println(session.getId()+": 열쇠를 배정받았습니다.");
						session.setAttribute("username", username);
						
						RequestDispatcher disp=request.getRequestDispatcher("jsp/login_ok.jsp");
						disp.forward(request, response);
					}else {
						RequestDispatcher disp=request.getRequestDispatcher("jsp/login_error.jsp");
						disp.forward(request, response);
					}
				}catch (Exception e){ //login error
					RequestDispatcher disp=request.getRequestDispatcher("jsp/login_error.jsp");
					disp.forward(request, response);
					e.printStackTrace();
				}
				
			}
		}else {
			//침해 대응 코드 
		}
	}

}
