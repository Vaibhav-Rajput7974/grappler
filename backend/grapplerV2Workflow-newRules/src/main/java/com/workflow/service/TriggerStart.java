package com.workflow.service;

import com.workflow.entity.*;
import com.workflow.entity.triggerConditionTypes.*;
import com.workflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TriggerStart {
  private static final Logger logger = LoggerFactory.getLogger(TriggerStart.class);
  @Autowired private ProjectRepo projectRepo;

  @Autowired private TicketRepo ticketRepo;
  @Autowired private StageService stageService;
  @Autowired private ActionStart actionStart;

  @Autowired private StageRepo stageRepo;

  @Autowired private FieldRepo fieldRepo;

  @Autowired private RuleRepo ruleRepo;

  public void triggerOnUser(
          List<Rule> ruleList, User existingValue, User updatedValue, Ticket ticket) {
    logger.info("trigger on user started ");
    ruleList.forEach(
            (rule -> {
              UserTrigger userTrigger = (UserTrigger) rule.getTrigger();
              logger.info(String.valueOf(updatedValue));
              System.out.println(userTrigger);
              logger.info(userTrigger.getOperation() + "---less");
              if (userTrigger.getOperation().equals("set")) {
                logger.info(updatedValue + "----" + userTrigger.getCurrent());
                if (updatedValue != null
                        && userTrigger.getCurrent() != null
                        && updatedValue.getId().equals(userTrigger.getCurrent())
                        && (existingValue == null || !existingValue.getId().equals(updatedValue.getId()))) {
                  logger.info("string set started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
                logger.info("set string  exicuted");
              } else if (userTrigger.getOperation().equals("change")) {
                System.out.println(updatedValue + "new" + userTrigger.getCurrent());
                System.out.println(existingValue + "old" + userTrigger.getPrevious());
                if (updatedValue != null
                        && existingValue != null
                        && userTrigger.getCurrent() != null
                        && userTrigger.getPrevious() != null
                        && updatedValue.getId().equals(userTrigger.getCurrent())
                        && existingValue.getId().equals(userTrigger.getPrevious())) {
                  logger.info("string change started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              } else if (userTrigger.getOperation().equals("remove")) {
                if (existingValue != null
                        && userTrigger.getPrevious() != null
                        && existingValue.getId().equals(userTrigger.getPrevious())
                        && (updatedValue == null || !updatedValue.getId().equals(existingValue.getId()))) {
                  logger.info("string remove started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              }
            }));
  }

  public void triggerOnUpdate(Ticket existing, Ticket updated, Long projectId)
          throws InvocationTargetException, IllegalAccessException {
    Class<?> ticketClass = Ticket.class;
    Method[] methods = ticketClass.getMethods();
    for (Method method : methods) {
      if (method.getName().startsWith("get")) {
        String attribute = method.getName().substring(3);

        Field attributField = fieldRepo.findByName(attribute);
        Project project = projectRepo.findById(projectId).get();

        if (attributField == null || attributField.equals("Class")) continue;

        if (attributField.getDataType().equals("STRING")) {

          String existingValue = (existing != null) ? (String) method.invoke(existing) : null;
          String updatedValue = (updated != null) ? (String) method.invoke(updated) : null;

          System.out.println(existingValue + "-----" + updatedValue);

          if ((updatedValue != null && existingValue == null)
                  || (updatedValue == null && existingValue != null)
                  || (updatedValue != null
                  && existingValue != null
                  && !updatedValue.equals(existingValue))) {
            System.out.println("string trigger co");
            List<Rule> ruleListString =
                    ruleRepo.findByTriggerFieldAndProject(attributField, project);
            triggerOnString(ruleListString, existingValue, updatedValue, updated);
          }
        } else if (attributField.getDataType().equals("NUMBER")) {
          Long existingValue = (existing != null) ? (Long) method.invoke(existing) : null;
          Long updatedValue = (updated != null) ? (Long) method.invoke(updated) : null;

          System.out.println(existingValue + "-----" + updatedValue);

          if ((updatedValue != null && existingValue == null)
                  || (updatedValue == null && existingValue != null)
                  || (updatedValue != null
                  && existingValue != null
                  && !updatedValue.equals(existingValue))) {
            System.out.println("number trigger");
            List<Rule> ruleListString =
                    ruleRepo.findByTriggerFieldAndProject(attributField, project);
            triggerOnNumber(ruleListString, existingValue, updatedValue, updated);
          }
        } else if (attributField.getDataType().equals("STAGE")) {
          Stage existingValue = (existing != null) ? (Stage) method.invoke(existing) : null;
          Stage updatedValue = (updated != null) ? (Stage) method.invoke(updated) : null;

          System.out.println(existingValue + "-----" + updatedValue);

          if ((updatedValue != null && existingValue == null)
                  || (updatedValue == null && existingValue != null)
                  || (updatedValue != null
                  && existingValue != null
                  && !updatedValue.equals(existingValue))) {
            System.out.println("stage trigger");
            List<Rule> ruleListString =
                    ruleRepo.findByTriggerFieldAndProject(attributField, project);
            stageTrigger(ruleListString, existingValue, updatedValue, updated);
          }
        } else if (attributField.getDataType().equals("USER")) {
          User existingValue = (existing != null) ? (User) method.invoke(existing) : null;
          User updatedValue = (updated != null) ? (User) method.invoke(updated) : null;

          System.out.println(existingValue + "-----" + updatedValue);

          if ((updatedValue != null && existingValue == null)
                  || (updatedValue == null && existingValue != null)
                  || (updatedValue != null
                  && existingValue != null
                  && !updatedValue.equals(existingValue))) {
            System.out.println("user trigger");
            List<Rule> ruleListString =
                    ruleRepo.findByTriggerFieldAndProject(attributField, project);
            triggerOnUser(ruleListString, existingValue, updatedValue, updated);
          }
        }
      }
    }
  }

  public void triggerOnNumber(
          List<Rule> ruleList, Long existingValue, Long updatedValue, Ticket ticket) {
    ruleList.forEach(
            (rule -> {
              NumberTrigger numberTrigger = (NumberTrigger) rule.getTrigger();
              logger.info(String.valueOf(updatedValue));
              System.out.println(numberTrigger);
              logger.info(numberTrigger.getOperation() + "---less");
              if (numberTrigger.getOperation().equals("less")) {
                logger.info(updatedValue + "----" + numberTrigger.getValue());
                if (updatedValue < numberTrigger.getValue()) {
                  logger.info("number less started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
                logger.info("set string  exicuted");
              } else if (numberTrigger.getOperation().equals("equall")) {
                System.out.println(updatedValue + "new" + numberTrigger.getValue());
                if (updatedValue == numberTrigger.getValue()) {
                  logger.info("number equall  started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              } else if (numberTrigger.getOperation().equals("greater")) {
                if (updatedValue > numberTrigger.getValue()) {
                  logger.info("string remove started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              }
            }));
  }

  public void triggerOnString(
          List<Rule> ruleList, String existingValue, String updatedValue, Ticket ticket) {
    ruleList.forEach(
            (rule -> {
              StringTrigger stringTrigger = (StringTrigger) rule.getTrigger();
              logger.info(updatedValue);
              System.out.println(stringTrigger);
              logger.info(stringTrigger.getOperation() + "---less");
              if (stringTrigger.getOperation().equals("set")) {
                logger.info(updatedValue + "----" + stringTrigger.getCurrentString());
                if (updatedValue != null
                        && stringTrigger.getCurrentString() != null
                        && updatedValue.equals(stringTrigger.getCurrentString())
                        && (existingValue == null || !existingValue.equals(updatedValue))) {
                  logger.info("string set started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
                logger.info("set string  exicuted");
              } else if (stringTrigger.getOperation().equals("change")) {
                System.out.println(updatedValue + "new" + stringTrigger.getCurrentString());
                System.out.println(existingValue + "old" + stringTrigger.getPreviousString());
                if (updatedValue != null
                        && existingValue != null
                        && stringTrigger.getCurrentString() != null
                        && stringTrigger.getPreviousString() != null
                        && updatedValue.equals(stringTrigger.getCurrentString())
                        && existingValue.equals(stringTrigger.getPreviousString())) {
                  logger.info("string change started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              } else if (stringTrigger.getOperation().equals("remove")) {
                if (existingValue != null
                        && stringTrigger.getPreviousString() != null
                        && existingValue.equals(stringTrigger.getPreviousString())
                        && (updatedValue == null || !updatedValue.equals(existingValue))) {
                  logger.info("string remove started");
                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                }
              }
            }));
  }

  public void stageTrigger(
          List<Rule> ruleList, Stage existingStage, Stage currentStage, Ticket ticket) {
    logger.info("stageTrigger started");
    ruleList.forEach(
            (rule) -> {
              StageTrigger stageTrigger = (StageTrigger) rule.getTrigger();
              System.out.println(stageTrigger.getOperation());
              if (stageTrigger.getOperation().equals("set")) {
                System.out.println(existingStage + "00" + stageTrigger.getPreviousStage());
                System.out.println(currentStage + "11" + stageTrigger.getCurrentStage());
                if (currentStage != null
                        && stageTrigger.getCurrentStage() != null
                        && currentStage.getStageId().equals(stageTrigger.getCurrentStage())
                        && (existingStage == null
                        || !existingStage.getStageId().equals(currentStage.getStageId()))) {
                  try {
                    System.out.println("set Started in stage");
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                  logger.info("stage set exicuted");
                }
              } else if (stageTrigger.getOperation().equals("change")) {
                System.out.println(existingStage + "00" + stageTrigger.getPreviousStage());
                System.out.println(currentStage + "11" + stageTrigger.getCurrentStage());

                if (existingStage != null
                        && currentStage != null
                        && stageTrigger.getCurrentStage() != null
                        && stageTrigger.getPreviousStage() != null
                        && stageTrigger.getPreviousStage().equals(existingStage.getStageId())
                        && stageTrigger.getCurrentStage().equals(currentStage.getStageId())) {

                  try {
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                  logger.info("stage change exicuted");
                }
              } else if (stageTrigger.getOperation().equals("remove")) {
                if (existingStage != null
                        && stageTrigger.getPreviousStage() != null
                        && stageTrigger.getPreviousStage().equals(existingStage.getStageId())
                        && (currentStage == null
                        || !existingStage.getStageId().equals(currentStage.getStageId()))) {
                  try {
                    logger.info("remove from the stage trigger");
                    actionStart.startAction(rule, ticket);
                  } catch (InvocationTargetException e) {
                    throw new RuntimeException(e);
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  } catch (NoSuchMethodException e) {
                    throw new RuntimeException(e);
                  }
                  logger.info("stage removed exicuted");
                }
              }
            });
  }

  public void triggerOnDate(DateTrigger dateTrigger, Rule rule, Long projectId)
          throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {

    logger.info(dateTrigger.getOperation() + "---less");
    if (dateTrigger.getOperation().equals("before")) {
      dueDateApprocha(
              dateTrigger.getDate(),
              -dateTrigger.getDays(),
              -dateTrigger.getDays(),
              -dateTrigger.getMinuter(),
              rule,
              projectId);
      logger.info("before date  exicuted");
    } else if (dateTrigger.getOperation().equals("equall")) {
      logger.info("equall date exicuted");
      dueDateApprocha(dateTrigger.getDate(), 0, 0, 0, rule, projectId);
    } else if (dateTrigger.getOperation().equals("after")) {
      logger.info("after date exicuted");
      dueDateApprocha(
              dateTrigger.getDate(),
              dateTrigger.getDays(),
              dateTrigger.getDays(),
              dateTrigger.getMinuter(),
              rule,
              projectId);
    }
  }

  public void dueDateApprocha(
          Date ondate, int days, int hours, int minute, Rule rule, Long projectId) {
    Project project = projectRepo.findById(projectId).orElse(null);
    logger.info("state cheak");
    if (project != null) {
      logger.info("date");
      Date currentDate = new Date();
      List<Ticket> ticketList =
              project.getStageList().stream()
                      .flatMap(stage -> stage.getTicketList().stream())
                      .collect(Collectors.toList());
      ticketList.forEach(
              ticket -> {
                Calendar calendar = Calendar.getInstance();
                if (ticket.getTicketEndingDate() != null) {
                  logger.info(" ticket ");
                  calendar.setTime(ticket.getTicketEndingDate());
                  calendar.add(Calendar.DAY_OF_MONTH, days);
                  calendar.add(Calendar.HOUR, hours);
                  calendar.add(Calendar.MINUTE, minute);
                  calendar.set(Calendar.SECOND, 0);
                  calendar.set(Calendar.MILLISECOND, 0);
                  Date notificationDate = calendar.getTime();

                  Calendar currentCalendar = Calendar.getInstance();
                  if (ondate != null) {
                    currentCalendar.setTime(currentDate);
                  } else {
                    currentCalendar.set(Calendar.SECOND, 0);
                  }
                  currentCalendar.set(Calendar.MILLISECOND, 0);
                  Date truncatedCurrentDate = currentCalendar.getTime();

                  System.out.println(notificationDate + "--" + truncatedCurrentDate);

                  if (notificationDate.compareTo(truncatedCurrentDate)
                          == 0) { // Check if notificationDate is within a 10-second window
                    System.out.println("hello");
                    try {
                      actionStart.startAction(rule, ticket);
                      ticketRepo.save(ticket);
                    } catch (InvocationTargetException e) {
                      throw new RuntimeException(e);
                    } catch (IllegalAccessException e) {
                      throw new RuntimeException(e);
                    } catch (NoSuchMethodException e) {
                      throw new RuntimeException(e);
                    }
                  }
                }
              });
    }
  }
}
