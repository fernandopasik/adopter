const mockMethod = (): jest.Mock => jest.fn((text: string): string => text);

export const blue = mockMethod();
export const dim = mockMethod();
export const green = mockMethod();
export const red = mockMethod();
export const yellow = mockMethod();
