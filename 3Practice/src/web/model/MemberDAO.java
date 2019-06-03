package web.model;

import java.sql.Connection;
import java.sql.*;

public class MemberDAO {
	public String login(String id, String pw) throws Exception {
		Connection con=null;
		PreparedStatement stmt=null;
		ResultSet rs=null;
		
		try {
			//	1.드라이버찾기
				Class.forName("com.mysql.jdbc.Driver");
				
				
			//	2.연결
				String url="jdbc:mysql://localhost:3306/openeg";
				String db_user="root";
				String db_pw="apmsetup";
				con=DriverManager.getConnection(url, db_user, db_pw);
				System.out.println(con);
				
				
			//	3.protocol 확인
				String sql="select username from board_member where userid=? and userpw=?";
				stmt=con.prepareStatement(sql);
				
				
			//	4.질의
				stmt.setString(1,id);
				stmt.setString(2,pw);
				rs=stmt.executeQuery();
				
				
				
			//	5.결과확인
				if(rs.next()) {
					String username=rs.getString("username");
					return username;
				}else {
					return null;
				}
				
	//	6.종료 
		}finally {
			rs.close();
			stmt.close();
			con.close();
		}
	}
}
