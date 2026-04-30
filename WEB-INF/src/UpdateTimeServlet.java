package com.tokenqueue;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

public class UpdateTimeServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        if (session == null || !Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"success\":false,\"message\":\"Unauthorized\"}");
            out.flush();
            return;
        }
        String param = req.getParameter("averageServiceTime");
        int newTime;
        try {
            newTime = Integer.parseInt(param);
            if (newTime <= 0)
                throw new NumberFormatException();
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false,\"message\":\"Invalid average service time\"}");
            out.flush();
            return;
        }
        QueueManager qm = (QueueManager) getServletContext().getAttribute("queueManager");
        qm.setAverageServiceTime(newTime);
        out.print("{\"success\":true,\"averageServiceTime\":" + newTime
                + ",\"queue\":" + qm.toJson() + "}");
        out.flush();
    }
}
