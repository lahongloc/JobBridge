package com.lhl.jobbridge.constants;

import java.util.Arrays;
import java.util.List;

public class JobQueue {
    public static final String JOB_APPLICATION_QUEUE = "jobbridgequeue";
    public static final String APPLICATION_STATUS_QUEUE = "jobbridgequeue";
    public static final List<String> queueNameList = Arrays.asList(JOB_APPLICATION_QUEUE, APPLICATION_STATUS_QUEUE);
}
