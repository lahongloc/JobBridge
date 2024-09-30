package com.lhl.jobbridge.configuration;

import com.lhl.jobbridge.constants.JobQueue;
import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

@Service
public class RabbitQueueDefine {
    @Autowired
    @Qualifier("amqpAdmin")
    AmqpAdmin rabbitAdminMain;

    @Bean
    public Queue incomingQueue() {
        for (String queueName : JobQueue.queueNameList) {
            Queue queue = new Queue(queueName, true, false, false, null);
            rabbitAdminMain.declareQueue(queue);
        }
        return null;
    }
}
