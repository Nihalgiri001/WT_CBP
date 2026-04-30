package com.tokenqueue;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class QueueManager {
    private List<Token> tokens = new ArrayList<>();
    private int tokenCounter = 1;
    private int averageServiceTime = 5;

    public synchronized Token generateToken() {
        Token t = new Token(tokenCounter++);
        tokens.add(t);
        updateWaitTimes();
        return t;
    }

    public synchronized Token getCurrentServing() {
        return tokens.stream()
                .filter(t -> "serving".equals(t.getStatus()))
                .findFirst().orElse(null);
    }

    public synchronized List<Token> getWaitingTokens() {
        return tokens.stream()
                .filter(t -> "waiting".equals(t.getStatus()))
                .collect(Collectors.toList());
    }

    public synchronized List<Token> getCompletedTokens() {
        return tokens.stream()
                .filter(t -> "completed".equals(t.getStatus()))
                .collect(Collectors.toList());
    }

    public synchronized List<Token> getAllTokens() {
        return new ArrayList<>(tokens);
    }

    public int getAverageServiceTime() {
        return averageServiceTime;
    }

    public void setAverageServiceTime(int t) {
        this.averageServiceTime = t;
    }

    public synchronized void serveNext() {
        Token serving = getCurrentServing();
        if (serving != null)
            serving.setStatus("completed");
        List<Token> waiting = getWaitingTokens();
        if (!waiting.isEmpty())
            waiting.get(0).setStatus("serving");
        updateWaitTimes();
    }

    public synchronized void reset() {
        tokens.clear();
        tokenCounter = 1;
    }

    private void updateWaitTimes() {
        boolean servingExists = getCurrentServing() != null;
        List<Token> waiting = getWaitingTokens();
        for (int i = 0; i < waiting.size(); i++) {
            waiting.get(i).setEstimatedWaitTime(
                    (i + (servingExists ? 1 : 0)) * averageServiceTime);
        }
    }

    public synchronized String toJson() {
        Token cs = getCurrentServing();
        String csJson = cs != null ? cs.toJson() : "null";
        String waitingJson = getWaitingTokens().stream()
                .map(Token::toJson)
                .collect(Collectors.joining(",", "[", "]"));
        String completedJson = getCompletedTokens().stream()
                .map(Token::toJson)
                .collect(Collectors.joining(",", "[", "]"));
        return String.format(
                "{\"currentServing\":%s,\"waitingTokens\":%s,\"completedTokens\":%s,\"averageServiceTime\":%d}",
                csJson, waitingJson, completedJson, averageServiceTime);
    }

    public synchronized Token findToken(String query) {
        if (query == null)
            return null;
        String q = query.trim().toUpperCase();
        return tokens.stream()
                .filter(t -> t.getTokenNumber().equals(q)
                        || String.valueOf(t.getId()).equals(q))
                .findFirst().orElse(null);
    }
}
