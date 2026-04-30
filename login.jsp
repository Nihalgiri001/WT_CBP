<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>

    <head>
        <title>Login</title>
        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body bgcolor="#ffcccc">
        <center>
            <br><br><br>
            <table border="5" bordercolor="red" bgcolor="white" cellpadding="20" style="text-align: center;">
                <tr>
                    <td>
                        <h1><b>ADMIN LOGIN</b></h1>
                        <% String error=(String) request.getAttribute("loginError"); %>
                            <% if (error !=null) { %>
                                <div id="login-error-msg" style="color:red;font-weight:bold;">
                                    <%= error %>
                                </div>
                                <% } else { %>
                                    <div id="login-error-msg" style="color:red;font-weight:bold;display:none;"></div>
                                    <% } %>
                                        <form id="login-form">
                                            Username: <input type="text" id="username"><br><br>
                                            Password: <input type="password" id="password"><br><br>
                                            <button type="submit" id="login-btn"
                                                style="background-color:blue;color:white;font-size:18px;">LOGIN</button>
                                        </form>
                                        <a href="index.jsp">Go Back</a>
                    </td>
                </tr>
            </table>
            <div id="toast"></div>
        </center>
        <script src="js/login.js"></script>
    </body>

    </html>