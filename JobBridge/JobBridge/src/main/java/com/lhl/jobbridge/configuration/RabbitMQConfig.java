package com.lhl.jobbridge.configuration;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.context.support.GenericWebApplicationContext;

@Configuration
@EnableRabbit
@EnableAutoConfiguration(exclude = RabbitAutoConfiguration.class)
public class RabbitMQConfig {
    @Autowired
    private GenericWebApplicationContext context;

    @Value("${spring.rabbitmq.host}")
    private String rabitHost;

    @Value("${spring.rabbitmq.port}")
    private int rabitPort;

    @Value("${spring.rabbitmq.username}")
    private String rabitUsername;

    @Value("${spring.rabbitmq.password}")
    private String rabitPassword;

    @Value("${spring.rabbitmq.virtual-host}")
    private String rabitVirtualHost;

    @Value("${spring.rabbitmq.virtual-host-job}")
    private String rabitVirtualHostJob;

    private CachingConnectionFactory getCachingConnectionFactoryCommon() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory(this.rabitHost, this.rabitPort);
        connectionFactory.setUsername(this.rabitUsername);
        connectionFactory.setPassword(this.rabitPassword);
        return connectionFactory;
    }

    @Primary
    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);
        return rabbitAdmin;
    }

    @Primary
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter()); // Set the converter
        return rabbitTemplate;
    }

    @Primary
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = this.getCachingConnectionFactoryCommon();
        connectionFactory.setVirtualHost(this.rabitVirtualHost);
        return connectionFactory;
    }

    @Primary
    @Bean("rabbitListenerContainerFactory")
    public SimpleRabbitListenerContainerFactory containerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter()); // Use the JSON converter for listeners as well
        return factory;
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}

