package com.tokenqueue;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

public class QueueStatusServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        QueueManager qm = (QueueManager) getServletContext().getAttribute("queueManager");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print("{\"success\":true,\"queue\":" + qm.toJson() + "}");
        out.flush();
    }
}