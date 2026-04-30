package com.tokenqueue;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class AppContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        QueueManager qm = new QueueManager();
        sce.getServletContext().setAttribute("queueManager", qm);
        System.out.println("[TokenQueueApp] QueueManager initialised.");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("[TokenQueueApp] Application shutting down.");
    }
}
