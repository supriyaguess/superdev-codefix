package com.internal.tasktracker;

public interface AssigneeSummary {
    String getAssignee();
    long getTotal();
    long getOpenCount();
    long getInProgressCount();
    long getDoneCount();
    long getOverdue();
}
