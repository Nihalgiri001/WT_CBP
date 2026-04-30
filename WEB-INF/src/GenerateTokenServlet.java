package com.tokenqueue;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

public class GenerateTokenServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        QueueManager qm = (QueueManager) getServletContext().getAttribute("queueManager");
        Token token = qm.generateToken();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print("{\"success\":true,\"token\":" + token.toJson() + "}");
        out.flush();
    }
}
