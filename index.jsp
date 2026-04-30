<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ page import="java.util.List" %>
        <%@ page import="com.tokenqueue.QueueManager" %>
            <%@ page import="com.tokenqueue.Token" %>
                <% QueueManager qm=(QueueManager) application.getAttribute("queueManager"); Token
                    currentServing=qm.getCurrentServing(); List<Token> waitingTokens = qm.getWaitingTokens();
                    int avgServiceTime = qm.getAverageServiceTime();
                    %>
                    <html>

                    <head>
                        <title>Token System</title>
                        <link rel="stylesheet" href="css/styles.css">
                    </head>

                    <body bgcolor="#ffffcc" text="#000080">
                        <center>
                            <h1 style="padding-top: 50px;">
                                <font color="red">Welcome to Token Queue!!!</font>
                            </h1>
                            <a href="admin.jsp"><b>Admin Login</b></a>
                            <br><br>
                            <table border="5" bordercolor="blue" bgcolor="#ffffff" cellpadding="10"
                                style="text-align: center;">
                                <tr>
                                    <td>
                                        <h2>Now Serving: <span id="current-token">
                                                <%= currentServing !=null ? currentServing.getTokenNumber() : "None" %>
                                            </span></h2>
                                        <h3>Waiting: <span id="queue-badge">
                                                <%= waitingTokens.size() %>
                                            </span></h3>
                                        <h3>Wait Time: <span id="avg-time">
                                                <%= avgServiceTime %>
                                            </span> min</h3>
                                    </td>
                                </tr>
                            </table>
                            <br>

                            <table border="2" bordercolor="green" cellpadding="5" style="text-align: center;">
                                <tr>
                                    <td>
                                        <h3 style="text-align: center;">Take a Token</h3>
                                        <button id="get-token-btn"
                                            style="background-color: yellow; font-size: 20px; font-weight: bold;">Give
                                            me token</button>
                                        <div id="token-result"></div>
                                    </td>
                                </tr>
                            </table>
                            <br>

                            <table border="3" bordercolor="purple" cellpadding="5" style="text-align: center;">
                                <tr>
                                    <td>
                                        <h3>Find Token</h3>
                                        <input type="text" id="search-input">
                                        <button id="search-btn">Search</button>
                                        <div id="search-result"></div>
                                    </td>
                                </tr>
                            </table>
                            <br>

                            <table border="1" width="50%" style="text-align: center;">
                                <tr>
                                    <td>
                                        <h3 id="queue-list-header">Queue (<%= waitingTokens.size() %> people)</h3>
                                        <div id="token-grid">
                                            <% for (Token t : waitingTokens) { %>
                                                <div>
                                                    <%= t.getTokenNumber() %> - <%= t.getEstimatedWaitTime() %> min
                                                </div>
                                                <% } %>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div id="toast" style="color:red; font-size:24px;"></div>
                        </center>
                        <script src="js/app.js"></script>
                    </body>

                    </html>