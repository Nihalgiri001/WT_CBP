<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ page import="java.util.List" %>
        <%@ page import="com.tokenqueue.QueueManager" %>
            <%@ page import="com.tokenqueue.Token" %>
                <% HttpSession sess=request.getSession(false); boolean isAdmin=sess !=null &&
                    Boolean.TRUE.equals(sess.getAttribute("isAdmin")); if (!isAdmin) {
                    response.sendRedirect("login.jsp"); return; } QueueManager qm=(QueueManager)
                    application.getAttribute("queueManager"); Token currentServing=qm.getCurrentServing(); List<Token>
                    waitingTokens = qm.getWaitingTokens();
                    List<Token> completedTokens = qm.getCompletedTokens();
                        int avgTime = qm.getAverageServiceTime();
                        %>
                        <html>

                        <head>
                            <title>Admin Area</title>
                            <link rel="stylesheet" href="css/styles.css">
                        </head>

                        <body bgcolor="#ccffff">
                            <center>
                                <h1 style="padding-top: 50px;">
                                    <font color="blue">ADMIN DASHBOARD</font>
                                </h1>
                                <a href="index.jsp">Back to main</a> | <button id="logout-btn">Logout</button>
                                <br><br>

                                <table border="1" cellpadding="5" bgcolor="yellow">
                                    <tr>
                                        <td>Waiting: <span id="stat-waiting">
                                                <%= waitingTokens.size() %>
                                            </span></td>
                                        <td>Serving: <span id="stat-serving">
                                                <%= currentServing !=null ? currentServing.getTokenNumber() : "None" %>
                                            </span></td>
                                        <td>Done: <span id="stat-completed">
                                                <%= completedTokens.size() %>
                                            </span></td>
                                        <td>Avg Time: <span id="stat-avg">
                                                <%= avgTime %> min
                                            </span></td>
                                    </tr>
                                </table>
                                <br>

                                <fieldset style="width: 50%;">
                                    <legend>Controls</legend>
                                    <button id="next-token-btn" style="background-color: lime; font-size: 18px;">Next
                                        Token</button>
                                    <button id="reset-queue-btn"
                                        style="background-color: red; color: white; font-size: 18px;">Reset
                                        Queue</button>
                                    <br><br>
                                    Time (min): <input type="number" id="avg-service-input" value="<%= avgTime %>">
                                    <button id="update-time-btn">Update</button>
                                </fieldset>
                                <br>

                                <h3>Waiting Queue <span id="admin-queue-badge">
                                        <%= waitingTokens.size() %>
                                    </span></h3>
                                <table border="1" id="waiting-table" bgcolor="white">
                                    <tbody id="waiting-tbody">
                                        <% for (int i=0; i < waitingTokens.size(); i++) { Token t=waitingTokens.get(i);
                                            %>
                                            <tr>
                                                <td>
                                                    <%= i + 1 %>
                                                </td>
                                                <td>
                                                    <%= t.getTokenNumber() %>
                                                </td>
                                                <td>Wait</td>
                                                <td>
                                                    <%= t.getEstimatedWaitTime() %> min
                                                </td>
                                                <td>
                                                    <%= t.getTimestamp() %>
                                                </td>
                                            </tr>
                                            <% } %>
                                    </tbody>
                                </table>

                                <h3>Completed <span id="completed-badge">
                                        <%= completedTokens.size() %>
                                    </span></h3>
                                <table border="1" id="completed-table" bgcolor="lightgray">
                                    <tbody id="completed-tbody">
                                        <% for (Token t : completedTokens) { %>
                                            <tr>
                                                <td>
                                                    <%= t.getTokenNumber() %>
                                                </td>
                                                <td>Done</td>
                                                <td>
                                                    <%= t.getTimestamp() %>
                                                </td>
                                            </tr>
                                            <% } %>
                                    </tbody>
                                </table>
                                <div id="toast"></div>
                            </center>
                            <script src="js/admin.js"></script>
                        </body>

                        </html>