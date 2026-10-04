package com.internal.tasktracker;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public enum TaskStatus {
    OPEN,
    IN_PROGRESS,
    DONE;

    public static Set<String> names() {
        return Arrays.stream(values()).map(Enum::name).collect(Collectors.toSet());
    }
}
