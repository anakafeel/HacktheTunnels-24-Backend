import { Timetable } from "@prisma/client";
import { prisma } from "../db";
import { Result, Ok, Err } from "ts-results";
import { AccountService } from ".";

export const createTimetable = async (
  email: string,
  name: string,
  scheduledEventIds: string[],
): Promise<Result<Timetable, Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  // Fetch scheduled events to check for overlaps
  const scheduledEvents = await prisma.scheduledEvent.findMany({
    where: {
      id: {
        in: scheduledEventIds.map(id => parseInt(id)),
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // Check for overlapping events
  for (let i = 0; i < scheduledEvents.length; i++) {
    for (let j = i + 1; j < scheduledEvents.length; j++) {
      const eventA = scheduledEvents[i];
      const eventB = scheduledEvents[j];
      // Check if the events overlap
      if (
        (eventA.startTime < eventB.endTime && eventA.endTime > eventB.startTime) ||
        (eventB.startTime < eventA.endTime && eventB.endTime > eventA.startTime)
      ) {
        return Err(new Error("Timetable creation failed: overlapping courses detected"));
      }
    }
  }

  const timetable = await prisma.timetable.create({
    data: {
      name,
      account: {
        connect: {
          id: account.id,
        },
      },
      timetableEvents: {
        create: scheduledEventIds.map((id) => ({
          scheduledEvent: {
            connect: {
              id: parseInt(id),
            },
          },
        })),
      },
    },
  });

  return Ok(timetable);
};

// The remaining functions can remain unchanged
export const getTimetableById = async (
  id: number,
): Promise<Result<Timetable, Error>> => {
  const timetable = await prisma.timetable.findUnique({
    where: {
      id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (timetable === null) {
    return Err(new Error("Timetable not found"));
  }

  return Ok(timetable);
};

export const getAccountTimetables = async (
  email: string,
): Promise<Result<Timetable[], Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const timetables = await prisma.timetable.findMany({
    where: {
      accountId: account.id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  return Ok(timetables);
};