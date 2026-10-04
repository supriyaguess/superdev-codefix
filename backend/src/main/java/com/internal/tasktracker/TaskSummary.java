package com.internal.tasktracker;

public interface TaskSummary {
    long getTotal();
    long getOpenCount();
    long getInProgressCount();
    long getDoneCount();
    long getHighPending();
    long getOverdue();
}
