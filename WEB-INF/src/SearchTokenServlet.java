package com.tokenqueue;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class SearchTokenServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        QueueManager qm = (QueueManager) getServletContext().getAttribute("queueManager");
        String query = req.getParameter("token");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        Token found = qm.findToken(query);
        if (found == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"success\":false,\"message\":\"Token not found\"}");
            out.flush();
            return;
        }
        int position = -1;
        int waitTime = 0;
        if ("waiting".equals(found.getStatus())) {
            List<Token> waiting = qm.getWaitingTokens();
            for (int i = 0; i < waiting.size(); i++) {
                if (waiting.get(i).getId() == found.getId()) {
                    position = i + 1;
                    break;
                }
            }
            waitTime = found.getEstimatedWaitTime();
        } else if ("serving".equals(found.getStatus())) {
            position = 0;
            waitTime = 0;
        }
        out.print("{\"success\":true,\"token\":" + found.toJson()
                + ",\"position\":" + position
                + ",\"estimatedWaitTime\":" + waitTime + "}");
        out.flush();
    }
}